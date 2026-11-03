// Minimal Supabase REST client for the Vercel functions (no dependencies).
// Uses the project's anon key: the database only lets anon call public.submit_lead()
// and upload to xrays/<existing lead_id>/. Nothing can be read back with this key.
export const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const KEY = process.env.SUPABASE_ANON_KEY || "";

export const configured = () => !!(SUPABASE_URL && KEY);
export const headers = (extra = {}) => ({ apikey: KEY, Authorization: `Bearer ${KEY}`, ...extra });

export function rpc(fn, args) {
  return fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(args)
  });
}

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export const LEAD_ID = /^[A-Za-z0-9-]{8,64}$/;
