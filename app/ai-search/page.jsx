"use client";

import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { categories } from "../data/constants";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Gelişmiş markdown parser: ardışık <li> elemanlarını <ul> ile sarmalar, başlıkları ve bold/italicleri destekler
function renderMarkdown(md) {
  if (!md) return null;
  const lines = md.split(/\n+/);
  const elements = [];
  let listBuffer = [];
  lines.forEach((line, idx) => {
    // Başlıklar
    if (/^\d+\.\s+(.+)/.test(line)) {
      if (listBuffer.length) {
        elements.push(<ul key={"ul-"+idx}>{listBuffer}</ul>);
        listBuffer = [];
      }
      elements.push(<div key={idx} className="font-bold text-blue-700 text-lg mt-4">{parseInline(line)}</div>);
      return;
    }
    if (/^\*\*(.+)\*\*$/.test(line)) {
      if (listBuffer.length) {
        elements.push(<ul key={"ul-"+idx}>{listBuffer}</ul>);
        listBuffer = [];
      }
      elements.push(<div key={idx} className="font-bold text-blue-700 text-lg mt-2">{parseInline(line.replace(/^\*\*|\*\*$/g, ""))}</div>);
      return;
    }
    if (/^#+\s?(.+)/.test(line)) {
      if (listBuffer.length) {
        elements.push(<ul key={"ul-"+idx}>{listBuffer}</ul>);
        listBuffer = [];
      }
      elements.push(<div key={idx} className="font-bold text-blue-700 text-lg mt-2">{parseInline(line.replace(/^#+\s?/, ""))}</div>);
      return;
    }
    // Liste
    if (/^[-*•]/.test(line.trim())) {
      listBuffer.push(<li key={idx} className="ml-6 list-disc text-gray-800">{parseInline(line.replace(/^[-*•]\s?/, ""))}</li>);
      return;
    }
    // Liste bitişi
    if (listBuffer.length) {
      elements.push(<ul key={"ul-"+idx}>{listBuffer}</ul>);
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

// Inline bold/italic parser: **kalın**, *italik* ve [link metni](url) ifadeleri her yerde işler
export function parseInline(text) {
  const parts = [];
  let lastIndex = 0;
  let match;

  // Bold pattern
  const boldRegex = /\*\*(.*?)\*\*/g;
  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<b key={`bold-${match.index}`}>{match[1]}</b>);
    lastIndex = boldRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // Simply return the parts array - no recursion needed
  return parts;
}

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
}

function SearchPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("query");
    if (q) {
      setQuery(q);
      askAI(null, q); // Call askAI with the query from URL
    }
  }, [searchParams]);

  async function askAI(e, forcedQuery) {
    if (e) e.preventDefault(); // Prevent default if event object is passed
    setLoading(true);
    setError("");
    setAnswer("");

    const currentQuery = forcedQuery !== undefined ? forcedQuery : query;

    if (!currentQuery) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://my-ai-agent-243439967412.europe-west1.run.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentQuery })
      });
      const data = await response.json();
      setAnswer(data.answer || "Cevap alınamadı.");
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
        <h2 className="text-3xl font-bold mb-4 text-blue-700 flex items-center justify-center gap-2"><Sparkles className="h-7 w-7 text-blue-400 animate-spin-slow" />Spor Dünyası hakkında sohbet et</h2>
        <p className="text-gray-700 mb-8">Sporlar hakkında istediğinizi sorun, AI size en uygun önerilerde bulunsun</p>
        <div className="bg-blue-50 rounded-xl p-8">
          <form onSubmit={askAI} className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
            <Input
              id="queryInput"
              type="text"
              placeholder="Sporla ilgili bir soru sor..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 min-w-0 text-base px-4 py-3 rounded-full border-2 border-blue-200 focus:border-blue-400 bg-white shadow"
              required
            />
            <Button type="submit" className="rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-3 text-base font-semibold shadow-md" disabled={loading}>
              {loading ? "Düşünüyor..." : "Sor"}
            </Button>
          </form>
          <div id="result" className="min-h-[48px] text-left text-base bg-white rounded-xl p-4 shadow-inner border border-blue-100">
            {error && <span className="text-red-600">{error}</span>}
            {!error && answer && renderMarkdown(answer)}
          </div>
        </div>
      </div>
    </div>
  )
}