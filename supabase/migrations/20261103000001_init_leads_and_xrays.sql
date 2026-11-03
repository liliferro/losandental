-- Losan Smile Path: leads + X-ray uploads (applied 2026-11-03 to project vnxwixupvydxqpncmabe).
-- The public page never reads or writes the table directly: it calls submit_lead() through /api/lead.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_id text not null unique,
  created_at timestamptz not null default now(),
  nombre text,
  email text,
  telefono text,
  idioma text,
  solucion_familia text,
  requiere_revision_medica boolean not null default false,
  intencion text,
  puntaje_preparacion int,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  referrer text,
  payload jsonb not null
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
alter table public.leads enable row level security;
revoke all on table public.leads from anon, authenticated;

create or replace function public.submit_lead(p jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text := p->>'lead_id';
begin
  if v_id is null or v_id !~ '^[A-Za-z0-9-]{8,64}$' then raise exception 'invalid lead_id'; end if;
  if coalesce((p->'contacto'->>'consentimiento')::boolean, false) is not true then raise exception 'consent required'; end if;
  if coalesce(p->'contacto'->>'email', '') = '' and coalesce(p->'contacto'->>'telefono', '') = '' then raise exception 'contact required'; end if;
  if pg_column_size(p) > 65536 then raise exception 'payload too large'; end if;
  insert into public.leads (lead_id, nombre, email, telefono, idioma, solucion_familia, requiere_revision_medica, intencion,
                            puntaje_preparacion, utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, payload)
  values (v_id,
          nullif(left(p->'contacto'->>'nombre', 120), ''), nullif(left(p->'contacto'->>'email', 200), ''), nullif(left(p->'contacto'->>'telefono', 30), ''),
          left(p->>'idioma', 5), left(p->'solucion_probable'->>'familia', 40), coalesce((p->>'requiere_revision_medica')::boolean, false),
          left(p->>'intencion', 40), case when (p->>'puntaje_preparacion') ~ '^\d{1,3}$' then (p->>'puntaje_preparacion')::int end,
          left(p->'utm'->>'source', 200), left(p->'utm'->>'medium', 200), left(p->'utm'->>'campaign', 200), left(p->'utm'->>'content', 200), left(p->'utm'->>'term', 200),
          left(p->>'referrer', 500), p)
  on conflict (lead_id) do nothing;
  return v_id;
end;
$$;
revoke all on function public.submit_lead(jsonb) from public, anon, authenticated;
grant execute on function public.submit_lead(jsonb) to anon;
comment on function public.submit_lead(jsonb) is 'Public entry point used by /api/lead. Validates consent and contact, inserts once per lead_id. Intentionally executable by anon.';

insert into storage.buckets (id, name, public) values ('xrays', 'xrays', false) on conflict (id) do nothing;
