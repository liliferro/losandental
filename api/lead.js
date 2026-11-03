// POST /api/lead  -> saves the Smile Path lead in Supabase (public.leads via submit_lead()).
// Optional: CRM_WEBHOOK_URL forwards the same JSON to a CRM (Zoho, HubSpot, Make, Zapier...).
import { rpc, json, configured, LEAD_ID } from "../lib/supabase.js";

export async function POST(request) {
  if (!configured()) return json({ error: "not_configured" }, 503);
  if (Number(request.headers.get("content-length") || 0) > 100_000) return json({ error: "too_large" }, 413);
  let lead;
  try { lead = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
  if (!lead || typeof lead !== "object" || !LEAD_ID.test(String(lead.lead_id || ""))) return json({ error: "invalid_lead" }, 400);

  const r = await rpc("submit_lead", { p: lead });
  if (!r.ok) {
    console.error("submit_lead failed", r.status, (await r.text()).slice(0, 300));
    return json({ error: "rejected" }, r.status >= 500 ? 502 : 400);
  }

  if (process.env.CRM_WEBHOOK_URL) {
    try {
      await fetch(process.env.CRM_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
    } catch (e) { console.error("CRM forward failed", e && e.message); }
  }
  return json({ ok: true, lead_id: lead.lead_id });
}
