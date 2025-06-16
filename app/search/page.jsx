"use client"

import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { categories } from "../data/constants";
import { useState } from "react";

// Decathlon linklerini markdown'dan çıkar
function extractDecathlonLinks(md) {
  if (!md) return [];
  const regex = /\[([^\]]+)\]\((https?:\/\/(?:www\.)?decathlon\.com\.tr[^\)]+)\)/g;
  const links = [];
  let match;
  while ((match = regex.exec(md)) !== null) {
    links.push({
      title: match[1],
      link: match[2]
    });
  }
  return links;
}

function fixDecathlonLink(link) {
  if (/id_\d+/.test(link)) {
    // /kategori-adi-id_123456/ gibi bir linkten kategori adını çek
    const match = link.match(/\/([a-zA-Z-]+)-id_\d+/);
    if (match) {
      return `https://www.decathlon.com.tr/search?Ntt=${encodeURIComponent(match[1].replace(/-/g, ' '))}`;
    }
  }
  return link;
}

function ProductCard({ title, link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col sm:flex-row items-center gap-4 border border-gray-200 rounded-xl p-6 mb-4 bg-white shadow-md hover:shadow-lg transition group"
      style={{ textDecoration: "none" }}
    >
      <div className="flex-shrink-0 w-24 h-24 bg-blue-50 rounded-lg overflow-hidden flex items-center justify-center border border-blue-200">
        <img
          src="/placeholder.png"
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1 text-left">
        <div className="font-bold text-blue-800 text-xl group-hover:underline">{title}</div>
        <div className="text-sm text-gray-600 break-all">{link}</div>
      </div>
    </a>
  );
}

// Gelişmiş markdown parser: başlık, bold, liste, satır arası
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
      elements.push(<div key={idx} className="font-bold text-blue-700 text-lg mt-4">{parseInline(line)}</div>);
      return;
    }
    if (/^\*\*(.+)\*\*$/.test(line)) {
      if (listBuffer.length) {
        elements.push(<ul key={"ul-" + idx}>{listBuffer}</ul>);
        listBuffer = [];
      }
      elements.push(<div key={idx} className="font-bold text-blue-700 text-lg mt-2">{parseInline(line.replace(/^\*\*|\*\*$/g, ""))}</div>);
      return;
    }
    if (/^#+\s?(.+)/.test(line)) {
      if (listBuffer.length) {
        elements.push(<ul key={"ul-" + idx}>{listBuffer}</ul>);
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
    <div className="space-y-2 text-base leading-relaxed">
      {elements}
    </div>
  );
}

// Inline bold/italic parser: **kalın** ve *italik* ifadeleri işler
function parseInline(text) {
  if (!text) return null;
  const boldRegex = /\*\*(.+?)\*\*/g;
  const italicRegex = /\*(.+?)\*/g;
  let parts = [];
  let lastIndex = 0;
  let match;
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

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setQuery(search);
    setLoading(true);
    setAnswer("");
    try {
      const payload = {
        query: `merhaba müşterim bana parantez içerisindeki soruyu soruyor. Bu soruya decathlon.com.tr'yi baz alarak benim ağzımdan kısa bir chatbot cevabı verebilir misin? Bu cevapta decathlon.com.tr'yi ziyaret et ve ürünlerinden tavsiyeler ver. 3500 karakteri geçmesin. En fazla 3 link öner. Derin analiz yapabilirsin. (Soru: ${search}) Ürün arama dışındaki sorulara "bu konuda yardımcı olamıyorum :( şeklinde cevap ver, ürün aramaya yönlendir.`
      };
      const response = await fetch("https://my-ai-agent-243439967412.europe-west1.run.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setAnswer(data.answer || "Cevap alınamadı.");
    } catch (err) {
      setAnswer("Hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const decathlonLinks = extractDecathlonLinks(answer);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation categories={categories} />
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">Ürün Arama (AI)</h2>
        <p className="text-gray-700 mb-8">Gelişmiş yapay zeka tavsiyeli arama deneyimi ile istediğiniz ürünü bulun</p>
        <div className="bg-gray-100 rounded-xl p-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6"
          >
            <input
              type="text"
              placeholder="Ürün veya kategori arayın..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 w-full md:w-auto text-base px-5 py-3 rounded-full border-2 border-blue-300 focus:border-blue-500 bg-white shadow-sm placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="rounded-full bg-blue-600 hover:bg-blue-700 px-8 py-3 text-base font-semibold text-white shadow-md transition-colors duration-200"
              disabled={loading}
            >
              {loading ? "Aranıyor..." : "Ara"}
            </button>
          </form>
          {answer && (
            <div className="mt-4 text-left text-base">
              {renderMarkdown(answer)}
              {decathlonLinks.length > 0 && (
                <div>
                  <div className="font-bold text-blue-700 mb-2">İlgili Ürün/Kategori Kartları:</div>
                  {decathlonLinks.map((item, i) => (
                    <ProductCard key={i} title={item.title} link={fixDecathlonLink(item.link)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 