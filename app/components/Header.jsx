"use client";

import { Search, User, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Header() {
  const router = useRouter();
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <div className="text-2xl font-bold text-blue-600 cursor-pointer">
                  DECATHLON
                </div>
              </Link>
              <Badge variant="secondary" className="bg-purple-200 font-bold text-purple-700">
                AI
              </Badge>
            </div>
            <div className="flex items-center space-x-4 md:hidden">
              <Button variant="ghost" size="icon" onClick={() => router.push("/account")}>
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push("/favorites")}>
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/cart")}>
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-600 text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </div>
          </div>

          <div className="flex-1 max-w-2xl mx-0 md:mx-8 order-2 md:order-none w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="ayakkabı"
                className="pl-10 pr-20 py-3 w-full rounded-full border-2 border-purple-200 focus:border-purple-400"
              />
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

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/account")}>
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => router.push("/favorites")}>
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/cart")}>
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-600 text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
