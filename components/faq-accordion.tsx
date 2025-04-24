"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-800 rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            className="w-full justify-between text-left p-4 hover:bg-gray-800 hover:text-white"
            onClick={() => toggleItem(index)}
          >
            <span>{item.question}</span>
            {openIndex === index ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </Button>
          {openIndex === index && (
            <div className="p-4 pt-0 bg-gray-900/50">
              <p className="text-gray-400">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
