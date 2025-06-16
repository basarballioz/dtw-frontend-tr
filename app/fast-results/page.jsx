import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { categories } from "../data/constants";

export default function FastResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation categories={categories} />
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-yellow-600">Hızlı Sonuçlar</h2>
        <p className="text-gray-700 mb-8">En hızlı şekilde ihtiyacınıza uygun ürünleri görün. Saniyeler içinde sonuç alın, zamandan kazanın!</p>
        <div className="bg-yellow-50 rounded-xl p-8">Burada hızlı sonuçlar ve öneriler arayüzü yer alacak.</div>
      </div>
    </div>
  )
} 