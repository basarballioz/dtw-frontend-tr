/**
 * API CLIENT REQUEST (Next.js API route: /api/ask-gemini) POST isteği atar.
 */
export async function askGemini(text) {
  const response = await fetch("/api/ask-gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Cevap alınamadı.");
  // Gemini API'den dönen cevaptan sadece metni alır
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Cevap alınamadı."
  );
} 