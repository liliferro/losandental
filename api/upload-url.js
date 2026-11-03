// POST /api/upload-url {lead_id, filename, size} -> {uploadUrl}
// Returns a one-time signed URL; the browser PUTs the file straight to Supabase Storage (xrays/<lead_id>/...),
// so large CT scans don't pass through the 4.5 MB function body limit.
import { SUPABASE_URL, headers, json, configured, LEAD_ID } from "../lib/supabase.js";

const OK_EXT = /\.(jpe?g|png|pdf|dcm)$/i;

export async function POST(request) {
  if (!configured()) return json({ error: "not_configured" }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const { lead_id, filename, size } = body || {};
  if (!LEAD_ID.test(String(lead_id || ""))) return json({ error: "invalid_lead" }, 400);
  if (typeof filename !== "string" || !OK_EXT.test(filename)) return json({ error: "invalid_type" }, 400);
  const maxMB = Number(process.env.MAX_UPLOAD_MB || 0);
  if (maxMB && Number(size) > maxMB * 1048576) return json({ error: "too_large" }, 413);

  const safe = filename.normalize("NFKD").replace(/[^\w.-]+/g, "_").slice(-80);
  const path = `${lead_id}/${Date.now()}-${safe}`;
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/upload/sign/xrays/${path.split("/").map(encodeURIComponent).join("/")}`, {
    method: "POST", headers: headers({ "Content-Type": "application/json" }), body: "{}"
  });
  if (!r.ok) {
    console.error("sign upload failed", r.status, (await r.text()).slice(0, 300));
    return json({ error: "rejected" }, r.status === 403 || r.status === 400 ? 403 : 502);
  }
  const { url } = await r.json();
  return json({ uploadUrl: `${SUPABASE_URL}/storage/v1${url}` });
}
