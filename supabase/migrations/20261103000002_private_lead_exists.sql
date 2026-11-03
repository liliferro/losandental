-- Upload rule for the private xrays bucket: anon may only upload into xrays/<lead_id>/ for a lead that exists.
-- The helper lives in a schema that is not exposed through the REST API.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon;
create or replace function private.lead_exists(v text)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.leads where lead_id = v) $$;
revoke all on function private.lead_exists(text) from public, anon, authenticated;
grant execute on function private.lead_exists(text) to anon;
drop policy if exists "xrays: upload for existing lead" on storage.objects;
create policy "xrays: upload for existing lead" on storage.objects
  for insert to anon
  with check (bucket_id = 'xrays' and private.lead_exists((storage.foldername(name))[1]));
