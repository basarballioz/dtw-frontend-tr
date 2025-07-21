"use client"

import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { categories } from "../data/constants";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askGemini } from "@/lib/api";

function renderMarkdown(md) {
  if (!md) return null;
  const lines = md.split(/\n+/);
  const elements = [];
  let listBuffer = [];
  lines.forEach((line, idx) => {
    // Başlıklar
    if (/^\d+\.\s+(.+)/.test(line)) {
      if (listBuffer.length) {
        elements.push(<ul key={"ul-" + idx}>{listBuffer}</ul>);
        listBuffer = [];
      }
      elements.push(<div key={idx} className="font-bold text-yellow-700 text-lg mt-4">{parseInline(line)}</div>);
      return;
    }
    if (/^\*\*(.+)\*\*$/.test(line)) {
      if (listBuffer.length) {
        elements.push(<ul key={"ul-" + idx}>{listBuffer}</ul>);
        listBuffer = [];
      }
      elements.push(<div key={idx} className="font-bold text-yellow-700 text-lg mt-2">{parseInline(line.replace(/^\*\*|\*\*$/g, ""))}</div>);
      return;
    }
    if (/^#+\s?(.+)/.test(line)) {
      if (listBuffer.length) {
        elements.push(<ul key={"ul-" + idx}>{listBuffer}</ul>);
        listBuffer = [];
      }
      elements.push(<div key={idx} className="font-bold text-yellow-700 text-lg mt-2">{parseInline(line.replace(/^#+\s?/, ""))}</div>);
      return;
    }
    // Liste
    if (/^[-*•]/.test(line.trim())) {
      listBuffer.push(<li key={idx} className="ml-6 list-disc text-gray-800">{parseInline(line.replace(/^[-*•]\s?/, ""))}</li>);
      return;
    }
    // Liste bitişi
    if (listBuffer.length) {
      elements.push(<ul key={"ul-" + idx}>{listBuffer}</ul>);
      listBuffer = [];
    }
    // Normal paragraf (bold/italic inline parse)
    elements.push(<div key={idx} className="text-gray-900">{parseInline(line)}</div>);
  });
  if (listBuffer.length) {
    elements.push(<ul key={"ul-last"}>{listBuffer}</ul>);
  }
  return (
    <div className="space-y-2 text-base">
      {elements}
    </div>
  );
}

function parseInline(text) {
  if (!text) return null;
  const boldRegex = /\*\*(.+?)\*\*/g;
  const italicRegex = /\*(.+?)\*/g;
  let parts = [];
  let lastIndex = 0;
  let match;
  // Bold parçala
  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<b key={"b-" + match.index}>{match[1]}</b>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  parts = parts.flatMap((part, i) => {
    if (typeof part !== "string") return part;
    const italics = [];
    let last = 0;
    let m;
    while ((m = italicRegex.exec(part)) !== null) {
      if (m.index > last) italics.push(part.slice(last, m.index));
      italics.push(<i key={"i-" + i + "-" + m.index}>{m[1]}</i>);
      last = m.index + m[0].length;
    }
    if (last < part.length) italics.push(part.slice(last));
    return italics;
  });
  return parts;
}

export default function FastResultsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [sku, setSku] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");
    const prompt = `https://www.decathlon.com.tr/tr/ajax/nfs/openvoice/reviews/product/${sku} incele ve yorumları analiz et. Genel memnuniyet skorunu elde et ve sentimenti net şekilde yaz (olumlu/olumsuz 2-3 madde). Yanıtı kısa ve özet tut, 3-4 satırı geçmesin. Do deep-research.`;
    try {
      const answer = await askGemini(prompt);
      setResult(answer);
    } catch (err) {
      setError("Hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation categories={categories} />
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-4xl font-extrabold mb-2 text-yellow-600">Ürün Yorum Analizi</h2>
        <p className="text-gray-600 mb-10 text-base">Bir ürünün SKU kodunu girerek, kullanıcı yorumlarının genel değerlendirmesini saniyeler içinde öğrenin.</p>
        <div className="bg-yellow-50 rounded-2xl p-10 shadow flex flex-col items-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-5 w-full"
          >
            <Input
              type="number"
              placeholder="Örn: SKU kodunu girin (SKU kodunu girin)"
              value={sku}
              onChange={e => setSku(e.target.value)}
              className="border-2 border-yellow-300 rounded-lg px-5 py-3 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
              required
            />
            <Button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-3 rounded-lg transition text-lg w-full max-w-xs disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Analiz Ediliyor..." : "Analizi Gör"}
            </Button>
          </form>
          <div className="mt-8 w-full min-h-[90px] flex justify-center">
            {error && <div className="text-red-600 font-semibold">{error}</div>}
            {result && !error && (
              <div className="bg-white rounded-xl p-6 shadow text-left w-full max-w-md">
                {renderMarkdown(result)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 