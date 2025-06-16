"use client"

import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { categories } from "../data/constants";
import { useState } from "react";

export default function FastResultsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [sku, setSku] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation categories={categories} />
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-4xl font-extrabold mb-2 text-yellow-600">Ürün Yorum Analizi</h2>
        <p className="text-gray-600 mb-10 text-base">Bir ürünün SKU kodunu girerek, kullanıcı yorumlarının genel değerlendirmesini saniyeler içinde öğrenin.</p>
        <div className="bg-yellow-50 rounded-2xl p-10 shadow flex flex-col items-center">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setResult(null);
              setTimeout(() => {
                setResult({
                  sku,
                  sentiment: "Olumlu",
                  summary: "Ürün genel olarak olumlu yorumlar almış ve kullanıcılar kalitesinden memnun.",
                  score: 0.82,
                });
                setLoading(false);
              }, 1500);
            }}
            className="flex flex-col items-center gap-5 w-full"
          >
            <input
              type="text"
              placeholder="Örn: 8401949 (SKU kodunu girin)"
              value={sku}
              onChange={e => setSku(e.target.value)}
              className="border-2 border-yellow-300 rounded-lg px-5 py-3 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
              required
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-3 rounded-lg transition text-lg w-full max-w-xs disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Analiz Ediliyor..." : "Analizi Gör"}
            </button>
          </form>
          <div className="mt-8 w-full min-h-[90px] flex justify-center">
            {result && (
              <div className="bg-white rounded-xl p-6 shadow text-left w-full max-w-md">
                <div className="font-semibold text-xl mb-2">Ürün genel değerlendirme: <span className="text-green-600 font-bold">{result.sentiment}</span></div>
                <div className="mb-2 text-gray-700">Skor: <span className="font-mono font-semibold">%{Math.round(result.score * 100)}</span></div>
                <div className="text-gray-800 leading-relaxed">{result.summary}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 