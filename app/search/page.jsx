import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { categories } from "../data/constants";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation categories={categories} />
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">Ürün Arama (AI)</h2>
        <p className="text-gray-700 mb-8">Gelişimiş yapay zeka tavsiyeli arama deneyimi ile istediğiniz ürünü bulun</p>
        <div className="bg-gray-100 rounded-xl p-8">Burada klasik arama ve filtreleme arayüzü yer alacak.</div>
      </div>
    </div>
  )
} 