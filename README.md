# Losan Dental · Smile Path

Quiz de 11 pasos que muestra al paciente su solución probable (implantes o All-on-4) y envía el lead a la clínica.

- **Producción:** Vercel. Cada push a `main` se despliega solo.
- **Datos:** Supabase (`losandental`). Leads en `public.leads` y radiografías en Storage `xrays/<lead_id>/`.
- **Editar:** `src/smile-path.src.html` → `python3 build.py` → commit y push.
- **Vistas internas:** `?demo=1` (paciente de ejemplo) y `?modo=clinica` (JSON que recibe el CRM).
- **Medición:** `window.dataLayer`, lista para GTM / GA4 / Meta. Los eventos están en `CHANGELOG.md`.

Detalles de arquitectura y reglas de trabajo: [`CLAUDE.md`](CLAUDE.md). Historial y esquema del payload: [`CHANGELOG.md`](CHANGELOG.md).
