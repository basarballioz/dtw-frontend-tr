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
      elements.push(<div key={idx} className="font-bold text-purple-700 text-lg mt-4">{parseInline(line)}</div>);
      return;
    }
    if (/^\*\*(.+)\*\*$/.test(line)) {
      if (listBuffer.length) {
        elements.push(<ul key={"ul-"+idx}>{listBuffer}</ul>);
        listBuffer = [];
      }
      elements.push(<div key={idx} className="font-bold text-purple-700 text-lg mt-2">{parseInline(line.replace(/^\*\*|\*\*$/g, ""))}</div>);
      return;
    }
    if (/^#+\s?(.+)/.test(line)) {
      if (listBuffer.length) {
        elements.push(<ul key={"ul-"+idx}>{listBuffer}</ul>);
        listBuffer = [];
      }
      elements.push(<div key={idx} className="font-bold text-purple-700 text-lg mt-2">{parseInline(line.replace(/^#+\s?/, ""))}</div>);
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
function parseInline(text) {
  if (!text) return null;

  const parts = [];
  // Regex to match bold (**text**), italic (*text*), and links ([text](url))
  const regex = /(\*{2}[^\*]+\*{2}|\*[^\*]+\*|\[[^\]]+\]\([^\)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const fullMatch = match[0];
    if (fullMatch.startsWith('**') && fullMatch.endsWith('**')) {
      parts.push(<b key={"b-" + match.index}>{fullMatch.slice(2, -2)}</b>);
    } else if (fullMatch.startsWith('*') && fullMatch.endsWith('*')) {
      parts.push(<i key={"i-" + match.index}>{fullMatch.slice(1, -1)}</i>);
    } else if (fullMatch.startsWith('[') && fullMatch.includes('](') && fullMatch.endsWith(')')) {
      const linkMatch = fullMatch.match(/\[([^\]]+)\]\(([^\)]+)\)/);
      if (linkMatch) {
        const linkText = linkMatch[1];
        const linkUrl = linkMatch[2];
        parts.push(<a key={"a-" + match.index} href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{linkText}</a>);
      }
    } else {
      // If it's a match but not one of our specific markdown types, push as plain text
      parts.push(fullMatch);
    }
    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // Flatten the array and ensure all elements are properly rendered (e.g., handle nested markdown if desired)
  return parts.flatMap((part, i) => {
    if (typeof part === 'string') {
      // This recursive call handles cases where bold/italic might be within link text,
      // or vice-versa, though the regex prioritizes the outermost markdown.
      // For a truly robust solution, a proper markdown parser library would be ideal.
      return parseInline(part);
    }
    return part;
  });
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
        <h2 className="text-3xl font-bold mb-4 text-purple-700 flex items-center justify-center gap-2"><Sparkles className="h-7 w-7 text-purple-400 animate-spin-slow" />Spor Dünyası hakkında sohbet et</h2>
        <p className="text-gray-700 mb-8">Sporlar hakkında istediğinizi sorun, AI size en uygun önerilerde bulunsun</p>
        <div className="bg-purple-50 rounded-xl p-8">
          <form onSubmit={askAI} className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
            <Input
              id="queryInput"
              type="text"
              placeholder="Sporla ilgili bir soru sor..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 min-w-0 text-base px-4 py-3 rounded-full border-2 border-purple-200 focus:border-purple-400 bg-white shadow"
              required
            />
            <Button type="submit" className="rounded-full bg-purple-600 hover:bg-purple-700 px-6 py-3 text-base font-semibold shadow-md" disabled={loading}>
              {loading ? "Düşünüyor..." : "Sor"}
            </Button>
          </form>
          <div id="result" className="min-h-[48px] text-left text-base bg-white rounded-xl p-4 shadow-inner border border-purple-100">
            {error && <span className="text-red-600">{error}</span>}
            {!error && answer && renderMarkdown(answer)}
          </div>
        </div>
      </div>
    </div>
  )
} 