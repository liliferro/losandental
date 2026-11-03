"""Builds the Losan Smile Path landing from src/smile-path.src.html.

Outputs:
  public/index.html     Production page served by Vercel (connected to /api and Supabase)
  dist/artifact.html    Claude artifact version (full page, endpoints empty)
  dist/_preview.html    Local test copy of the artifact version

Run:  python3 build.py      (no dependencies)
"""
import base64
import pathlib

HERE = pathlib.Path(__file__).parent
SRC = HERE / "src" / "smile-path.src.html"
ASSETS = HERE / "src" / "assets"


def data_uri(name):
    return "data:image/png;base64," + base64.b64encode((ASSETS / name).read_bytes()).decode()


src = SRC.read_text(encoding="utf-8")
body = src.replace("{{LOGO}}", data_uri("logo.png")).replace("{{DOCTOR}}", data_uri("doctor.png"))

# 1) Local preview of the artifact version (endpoints empty)
(HERE / "dist").mkdir(exist_ok=True)
(HERE / "dist" / "_preview.html").write_text(
    '<!doctype html><html><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
    '</head><body style="margin:0">' + body + "</body></html>",
    encoding="utf-8",
)

# 2) Production page: real <head>, settings connected to the Vercel functions
lines = body.split("\n")
content = "\n".join(l for l in lines if not l.startswith("<title>") and "claude:viewport-fit-sides" not in l)

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Implants or All-on-4? Find Your Smile Path | Losan Dental</title>
<meta name="description" content="Map your teeth on an X-ray, answer a few quick questions and see your probable implant or All-on-4 solution at Losan Dental in Los Algodones, 7 miles from Yuma, AZ. Free, about 3 minutes.">
<meta name="theme-color" content="#002553">
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:title" content="Implants or All-on-4? Find your smile path">
<meta property="og:description" content="A 3-minute screening that shows your probable implant or All-on-4 solution before you travel to Losan Dental.">
<!-- Add your hosted share image: <meta property="og:image" content="https://YOUR-DOMAIN/og-smile-path.jpg"> -->
<link rel="icon" type="image/png" href="{FAVICON}">

<script>
  /* Page settings. Field list and CRM payload schema: CHANGELOG.md.
     aiEndpoint:     /api/notes  -> Claude writes the personal notes (needs ANTHROPIC_API_KEY in Vercel; without it the page uses built-in notes).
     leadEndpoint:   /api/lead   -> saves the lead in Supabase (table public.leads).
     uploadEndpoint: /api/upload-url -> one-time upload URL to Supabase Storage (bucket xrays/<lead_id>/).
     Values marked [[POR CONFIRMAR]] must be confirmed by the clinic before they are filled in. */
  window.SMILE_PATH_CONFIG = {
    aiEndpoint: "/api/notes",
    leadEndpoint: "/api/lead",
    uploadEndpoint: "/api/upload-url",
    REQUIRED_CONTACT: "email",  // "email" | "phone"   [[POR CONFIRMAR]]
    ENABLE_REWARD: false,
    rewardText: "",             // [[POR CONFIRMAR: beneficio real]]
    priceFrom: "",              // [[POR CONFIRMAR: rango de precio por arcada / "desde"]]
    insurancePolicy: "",        // [[POR CONFIRMAR: política de seguros de Losan]]
    privacyUrl: "",             // [[POR CONFIRMAR: URL del aviso de privacidad]]
    replyTime: "",              // [[POR CONFIRMAR: tiempo de respuesta]]
    maxUploadMB: 0              // [[POR CONFIRMAR]]
  };
</script>

<style>
  :root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
  body{margin:0;font-family:system-ui,sans-serif;font-size:14px}
  img{max-width:100%}
  [hidden]{display:none!important}
</style>
</head>
<body>
"""

page = HEAD.replace("{FAVICON}", data_uri("favicon.png")) + content + "\n</body>\n</html>\n"
(HERE / "public").mkdir(exist_ok=True)
(HERE / "public" / "index.html").write_text(page, encoding="utf-8")
# 3) Claude artifact version: same page with endpoints empty (the artifact sandbox blocks fetch; it runs in
#    preview mode and asks Claude for the notes through the `sample` capability)
artifact = page
for k in ("aiEndpoint", "leadEndpoint", "uploadEndpoint"):
    artifact = artifact.replace('%s: "/api/' % k, '%s: "" //' % k, 1)
(HERE / "dist" / "artifact.html").write_text(artifact, encoding="utf-8")
print("built: public/index.html (%d KB), dist/artifact.html, dist/_preview.html" % (len(page) // 1024))
