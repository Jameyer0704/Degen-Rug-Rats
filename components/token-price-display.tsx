"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface TokenPriceDisplayProps {
  price: number
  priceChange: number
}

export default function TokenPriceDisplay({ price, priceChange }: TokenPriceDisplayProps) {
  const isPositive = priceChange >= 0

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold">{formatCurrency(price)}</span>
      <span className={`text-sm flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? "+" : ""}
        {priceChange}%
        {isPositive ? <ArrowUpRight className="h-3 w-3 ml-0.5" /> : <ArrowDownRight className="h-3 w-3 ml-0.5" />}
      </span>
    </div>
  )
}
