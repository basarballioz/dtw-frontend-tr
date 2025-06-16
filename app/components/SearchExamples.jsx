import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function SearchExamples({ examples }) {
  const router = useRouter();

  const handleExampleClick = (example) => {
    router.push(`/ai-search?query=${encodeURIComponent(example)}`);
  };

  return (
    <div className="text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Örnek aramalar:</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {examples.map((example, index) => (
          <Button
            key={index}
            variant="outline"
            className="rounded-full bg-white hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
            onClick={() => handleExampleClick(example)}
          >
            {example}
          </Button>
        ))}
      </div>
    </div>
  )
}
