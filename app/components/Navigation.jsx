"use client";

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Navigation({ categories }) {
  const router = useRouter();
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 py-4 overflow-x-auto">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant="ghost"
              className="whitespace-nowrap text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => router.push(`/category/${encodeURIComponent(category)}`)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}
