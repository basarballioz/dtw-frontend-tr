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

// Inline bold/italic parser: **kalın**, *italik* ve [link metni](url) ifadeleri işler
function parseInline(text) {
  if (!text) return null;

  const parts = [];
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
      parts.push(fullMatch);
    }
    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // Recursively parse any remaining parts for nested inline elements
  return parts.map((part, i) => {
    if (typeof part === 'string') {
      // This is a simplified recursive call for demonstration. 
      // For robust nested parsing, you'd need a more complex tokenizer/parser.
      // For now, it will re-process bold/italic/links that might be inside a link text (though less common).
      return parseInlineInner(part, i); 
    }
    return part;
  });
}

// Helper function for recursive inline parsing to handle nesting
function parseInlineInner(text, keyPrefix) {
  if (!text) return null;
  const boldRegex = /\*\*(.+?)\*\*/g;
  const italicRegex = /\*(.+?)\*/g;
  const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;

  let parts = [];
  let lastIndex = 0;
  let match;

  const processText = (startIndex, endIndex) => {
    if (endIndex > startIndex) {
      parts.push(text.slice(startIndex, endIndex));
    }
  };

  // Process links first to avoid issues with bold/italic inside links
  while ((match = linkRegex.exec(text)) !== null) {
    processText(lastIndex, match.index);
    const linkText = match[1];
    const linkUrl = match[2];
    parts.push(<a key={`a-${keyPrefix}-${match.index}`} href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{linkText}</a>);
    lastIndex = match.index + match[0].length;
  }
  processText(lastIndex, text.length);

  // Now process bold and italic on the resulting parts, ensuring not to re-process <a> tags
  parts = parts.flatMap((part, i) => {
    if (typeof part !== 'string') return part; // Skip non-string (already processed) parts

    const boldItalicParts = [];
    let currentLastIndex = 0;
    let boldMatch;
    while ((boldMatch = boldRegex.exec(part)) !== null) {
      if (boldMatch.index > currentLastIndex) {
        boldItalicParts.push(part.slice(currentLastIndex, boldMatch.index));
      }
      boldItalicParts.push(<b key={`b-${keyPrefix}-${i}-${boldMatch.index}`}>{boldMatch[1]}</b>);
      currentLastIndex = boldMatch.index + boldMatch[0].length;
    }
    if (currentLastIndex < part.length) {
      boldItalicParts.push(part.slice(currentLastIndex));
    }

    return boldItalicParts.flatMap((subPart, j) => {
      if (typeof subPart !== 'string') return subPart;
      const italics = [];
      let italicLast = 0;
      let italicMatch;
      while ((italicMatch = italicRegex.exec(subPart)) !== null) {
        if (italicMatch.index > italicLast) italics.push(subPart.slice(italicLast, italicMatch.index));
        italics.push(<i key={`i-${keyPrefix}-${i}-${j}-${italicMatch.index}`}>{italicMatch[1]}</i>);
        italicLast = italicMatch.index + italicMatch[0].length;
      }
      if (italicLast < subPart.length) italics.push(subPart.slice(italicLast));
      return italics;
    });
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
        query: `merhaba müşterim bana parantez içerisindeki soruyu soruyor. Bu soruya decathlon.com.tr'yi baz alarak benim ağzımdan kısa bir cevap verebilir misin? Bu cevapta decathlon.com.tr'yi ziyaret et ve ürünlerinden tavsiyeler ver. 3500 karakteri geçmesin. En fazla 3 link öner. Derin analiz yapabilirsin. (Soru: ${search}) Ürün arama dışındaki sorulara "bu konuda yardımcı olamıyorum :( şeklinde cevap ver, ürün aramaya yönlendir.`
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