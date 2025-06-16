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
      <div className="flex-shrink-0 p-4 w-24 h-24 bg-blue-50 rounded-lg overflow-hidden flex items-center justify-center border border-blue-200">
        <svg role="img" aria-hidden="true" className="decathlon-logo vtmn-w-full vtmn-h-full" viewBox="0 0 705 140" fill="#3643ba"><title>Decathlon</title><path d="M107.707 20C68.6202 20 20 60.4415 20 93.9589C20 111.269 33.2965 120 50.858 120C63.7531 120 79.3578 115.283 94.4105 106.202V39.3176C90.3964 46.1917 71.5304 73.8886 56.3773 88.6402C48.6503 96.1666 42.5289 99.428 37.2604 99.428C31.3397 99.428 28.5299 95.4139 28.5299 89.4431C28.5299 62.3482 74.1395 27.1249 104.345 27.1249C116.789 27.1249 124.817 32.6443 124.817 43.3818C124.817 53.2162 118.144 65.5594 106.754 76.9493V97.6718C126.623 81.9669 138.515 61.9468 138.515 45.7902C138.515 28.7807 125.268 20 107.707 20Z M223.215 105H270.515V89.8H241.215V77.05H267.165V62.9H241.215V50.15H270.515V35H223.215V105ZM329.215 74.85C322.365 85.75 315.715 90.3 307.165 90.3C296.065 90.3 289.615 82.5 289.615 68.95C289.615 56.1 295.565 49.7 304.715 49.7C310.765 49.7 315.765 52.4 317.315 61.4H335.315C333.365 44.25 322.415 33.6 304.915 33.6C284.615 33.6 271.265 47.95 271.265 69.95C271.265 92.1 284.615 106.4 306.565 106.4C320.915 106.4 330.665 100.4 337.115 92.3H361.665V105H379.565V35H354.165L329.215 74.85ZM361.665 78.25H345.815L361.665 52.5V78.25ZM184.815 35H158.515V105H184.815C205.665 105 219.115 91.25 219.115 70C219.115 48.75 205.665 35 184.815 35ZM184.565 89.8H176.515V50.15H184.565C194.965 50.15 200.815 57.5 200.815 70C200.815 82.45 194.965 89.8 184.565 89.8ZM586.165 33.6C565.015 33.6 550.815 47.95 550.815 70C550.815 92.05 565.015 106.4 586.165 106.4C607.365 106.4 621.515 92.05 621.515 70C621.515 47.95 607.365 33.6 586.165 33.6ZM586.165 90.3C575.765 90.3 569.215 83.35 569.215 70C569.215 56.65 575.765 49.7 586.165 49.7C596.615 49.7 603.115 56.65 603.115 70C603.115 83.35 596.615 90.3 586.165 90.3ZM384.065 50.15H401.715V105H419.715V50.15H437.365V35H384.065L384.065 50.15ZM667.465 35V73.55L644.265 35H625.615V105H643.015V64.85L667.165 105H684.865V35L667.465 35ZM525.315 35H507.315V105H552.465V89.85H525.315V35ZM484.115 61.7H459.865V35H441.865V105H459.865V76.8H484.115V105H502.115V35H484.115V61.7Z"></path></svg>
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
        query: `merhaba müşterim bana parantez içerisindeki soruyu soruyor. Bu soruya decathlon.com.tr'yi baz alarak benim ağzımdan kısa bir cevap verebilir misin? Bu cevapta decathlon.com.tr'yi ziyaret et ve ürünlerinden tavsiyeler ver. 3500 karakteri geçmesin. En fazla 3 link öner. Derin analiz yapabilirsin. (Soru: ${search})`
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