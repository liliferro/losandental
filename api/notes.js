// POST /api/notes {data} -> {headline, summary, why[], ask[], prep[]}
// Claude writes the patient's personal notes. The prompt is built here from the quiz data only
// (the client's prompt text is ignored), so the endpoint can't be used as a general chatbot.
// Without ANTHROPIC_API_KEY it answers 503 and the page falls back to its built-in notes.
import { json } from "../lib/supabase.js";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: "not_configured" }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const data = body && body.data;
  const raw = JSON.stringify(data || null);
  if (!data || typeof data !== "object" || raw.length > 8000) return json({ error: "invalid_data" }, 400);

  const lang = data.language === "Español" ? "Spanish (Latin American, warm, usted)" : "English";
  const prompt = `You write a short personal note for a prospective patient of Losan Dental, an implant and prosthodontic clinic in Los Algodones, Mexico (7 miles from Yuma, AZ). The patient just finished a screening quiz. A rules engine already chose their probable path; explain it, do not change it.

Rules:
- Write in ${lang}, second person, plain words, 7th-grade reading level, warm and confident, no hype, no emoji.
- Never diagnose. Never say they are or are not a candidate. Never quote prices or success rates. Never promise outcomes.
- Say clearly that Dr. José Luis (oral surgeon) and Dr. Diego López (prosthodontist) confirm the exact treatment after an exam and a 3D CT scan.
- Use only facts in the data. Mention at most two health factors, kindly.
- "All-on-4" means a fixed full-arch bridge on 4 implants.

Reply with only JSON: {"headline": string (max 60 chars), "summary": string (2-3 sentences), "why": [3 short strings explaining why this path fits their answers], "ask": [3 questions to ask at the consultation], "prep": [2-3 practical prep tips for their trip or health]}

Patient data:
${raw}`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 900, messages: [{ role: "user", content: prompt }] })
    });
    if (!r.ok) { console.error("anthropic", r.status, (await r.text()).slice(0, 300)); return json({ error: "ai_failed" }, 502); }
    const out = await r.json();
    const text = (out.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    const m = text.match(/\{[\s\S]*\}/);
    return json(JSON.parse(m ? m[0] : text));
  } catch (e) {
    console.error("notes failed", e && e.message);
    return json({ error: "ai_failed" }, 502);
  }
}
