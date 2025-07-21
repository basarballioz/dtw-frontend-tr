/**
 * SERVER-SIDE API ROUTE (Next.js Route Handler) 
 * Endpoint: /api/ask-gemini
 */
export async function POST(req) {
  const { text } = await req.json();
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // MAKE REQUEST TO GOOGLE GEMINI API
  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text }]
          }
        ]
      })
    }
  );

  const data = await geminiRes.json();
  return new Response(JSON.stringify(data), {
    status: geminiRes.status,
    headers: { "Content-Type": "application/json" }
  });
} 