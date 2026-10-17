// Supabase Edge Function: name it "assistant"
// Secret needed: ANTHROPIC_API_KEY (Project Settings -> Edge Functions -> Secrets)
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { messages, context } = await req.json();
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system:
          "You are a friendly personal assistant inside the user's dashboard. Reply in the language the user writes in (Sinhala or English). Be concise and practical. Use LKR for money. User context: " +
          JSON.stringify(context || {}),
        messages: (messages || []).slice(-12),
      }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || "AI error");
    const reply = d.content.map((c: { text?: string }) => c.text || "").join("");
    return new Response(JSON.stringify({ reply }), { headers: { ...cors, "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, "content-type": "application/json" } });
  }
});
