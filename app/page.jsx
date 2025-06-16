import { Search, User, Heart, ShoppingCart, Zap, Brain, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const categories = [
    "Koşu",
    "Futbol",
    "Tenis",
    "Yüzme",
    "Bisiklet",
    "Dağcılık",
    "Fitness",
    "Yoga",
    "Kamp",
    "Balık Avı",
    "Kayak",
    "Basketbol",
  ]

  const searchExamples = [
    "evde spor yapmak istiyorum",
    "koşuya başlamak için ne gerekiyor",
    "futbol malzemeleri",
    "kamp ekipmanları",
  ]

  return (
    (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-600">
                <span className="bg-blue-600 text-white px-2 py-1 rounded">D</span>
                ECATHLON
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                AI
              </Badge>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="ayakkabı"
                  className="pl-10 pr-20 py-3 w-full rounded-full border-2 border-purple-200 focus:border-purple-400" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                  <Badge variant="outline" className="text-purple-600 border-purple-300">
                    AI
                  </Badge>
                  <Button size="sm" className="rounded-full bg-purple-600 hover:bg-purple-700">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-600 text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 py-4 overflow-x-auto">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant="ghost"
                className="whitespace-nowrap text-gray-700 hover:text-purple-600 hover:bg-purple-50">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Arama yapmak için yukarıdaki <span className="text-purple-600">AI destekli arama</span> özelliğini kullanın
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Normal arama veya AI destekli arama arasında geçiş yapabilir, aradığınız ürünlere hızlıca ulaşabilirsiniz.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Normal Search */}
            <div
              className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-md transition-shadow">
              <div
                className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Normal Arama</h3>
              <p className="text-gray-600">Geleneksel arama deneyimi ile istediğiniz ürünü bulun</p>
            </div>

            {/* AI-Powered Search - Highlighted */}
            <div
              className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              <div
                className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Destekli Arama</h3>
              <p className="text-gray-600">Doğal dille arama yapın, AI size en uygun ürünleri önersin</p>
            </div>

            {/* Fast Results */}
            <div
              className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-md transition-shadow">
              <div
                className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hızlı Sonuçlar</h3>
              <p className="text-gray-600">İhtiyacınıza uygun ürünleri saniyeler içinde görün</p>
            </div>
          </div>

          {/* Search Examples */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Örnek aramalar:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {searchExamples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="rounded-full bg-white hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700">
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>)
  );
}
