import { SearchIcon, Brain, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FeatureCards() {
  const router = useRouter();
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <div
        className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => router.push("/search")}
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <SearchIcon className="h-8 w-8 text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Ürün arama (AI)</h3>
        <p className="text-gray-600">Gelişimiş yapay zeka tavsiyeli arama deneyimi ile istediğiniz ürünü bulun</p>
      </div>

      <div
        className="bg-white rounded-2xl p-8 shadow-lg border-2 relative overflow-hidden cursor-pointer animate-ai-glow"
        onClick={() => router.push("/ai-search")}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"></div>
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="h-8 w-8 text-blue-600 animate-spin-slow" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Spor Dünyası hakkında sohbet et</h3>
        <p className="text-gray-600">Sporlar hakkında istediğinizi sorun, AI size en uygun önerilerde bulunsun</p>
      </div>

      <div
        className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => router.push("/fast-results")}
      >
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Belirli bir ürün hakkında yorum analizi yap</h3>
        <p className="text-gray-600">İhtiyacınıza uygun ürünleri saniyeler içinde görün</p>
      </div>
    </div>
  )
}
