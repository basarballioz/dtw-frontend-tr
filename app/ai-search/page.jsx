import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { categories } from "../data/constants";

export default function AiSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation categories={categories} />
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-purple-700">Spor Dünyası hakkında sohbet et</h2>
        <p className="text-gray-700 mb-8">Sporlar hakkında istediğinizi sorun, AI size en uygun önerilerde bulunsun</p>
        <div className="bg-purple-50 rounded-xl p-8">Burada AI tabanlı arama arayüzü ve öneriler yer alacak.</div>
      </div>
    </div>
  )
} 