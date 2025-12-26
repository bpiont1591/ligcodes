export async function onRequest({ request, env }) {
  // Basic CORS (same-origin on Pages usually, but OPTIONS helps during dev)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  // Honeypot (optional)
  const hp = String(data?.hpWebsite || "").trim();
  if (hp.length > 0) {
    return new Response("Bot detected", { status: 400 });
  }

  const desc = String(data?.desc || "").trim();
  if (desc.length < 10) {
    return new Response("Opis za krótki (min 10 znaków)", { status: 400 });
  }

  const content =
`⚡ **NOWE ZAMÓWIENIE BOTA**
📦 Pakiet: **${data.packLabel || "—"}** (${data.packId || "—"})
💸 ${data.priceLine || "—"}

👤 Nick/ID: ${data.user || "—"}
🌐 Serwer: ${data.guild || "—"}
⏳ Termin: ${data.deadline || "—"}

📝 Opis:
${desc}
`;

  const webhookUrl = env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return new Response("Missing DISCORD_WEBHOOK_URL", { status: 500 });
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: content.slice(0, 1900) }),
  });

  if (!res.ok) {
    const t = await res.text();
    return new Response("Webhook error: " + t, { status: 502 });
  }

  return new Response("OK", { status: 200 });
}
