"use client";

import Header from "./components/Header"
import Navigation from "./components/Navigation"
import FeatureCards from "./components/FeatureCards"
import SearchExamples from "./components/SearchExamples"
import { categories, searchExamples } from "./data/constants"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation categories={categories} />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Arama yapmak için yukarıdaki <span className="text-purple-600">AI destekli arama</span> özelliğini kullanın
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Normal arama veya AI destekli arama arasında geçiş yapabilir, aradığınız ürünlere hızlıca ulaşabilirsiniz.
          </p>
          <FeatureCards />
          <SearchExamples examples={searchExamples} />
        </div>
      </main>
    </div>
  );
}
