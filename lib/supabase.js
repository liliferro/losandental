// Minimal Supabase REST client for the Vercel functions (no dependencies).
// Uses the project's anon key: the database only lets anon call public.submit_lead()
// and upload to xrays/<existing lead_id>/. Nothing can be read back with this key.
// Defaults point at the losandental project. The anon key is public by design (it ships in any Supabase
// web client); the database only allows it to call submit_lead() and upload into an existing lead's folder.
// Vercel env vars SUPABASE_URL / SUPABASE_ANON_KEY override these. Never put a service_role key here.
const DEFAULT_URL = "https://vnxwixupvydxqpncmabe.supabase.co";
const DEFAULT_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZueHdpeHVwdnlkeHFwbmNtYWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NDQyNTEsImV4cCI6MjEwOTMyMDI1MX0.7muGQCphTkGCh0usN23OKwq94MYE6DydhS3qdtBSDM4";
export const SUPABASE_URL = (process.env.SUPABASE_URL || DEFAULT_URL).replace(/\/$/, "");
const KEY = process.env.SUPABASE_ANON_KEY || DEFAULT_ANON;

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
