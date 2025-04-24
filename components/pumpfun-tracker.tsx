"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Crown, TrendingUp, Clock, DollarSign, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { formatCurrency } from "@/lib/utils"

interface Trade {
  id: string
  timestamp: number
  tokenSymbol: string
  tokenAddress: string
  price: number
  priceUSD: number
  marketAddress: string
}

const PUMPFUN_URL = "https://pump.fun/coin/G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump"

const PumpFunTracker = () => {
  const [trades, setTrades] = useState<Trade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Mock data for initial display
  const mockTrades: Trade[] = [
    {
      id: "trade-1",
      timestamp: Date.now() - 1000 * 60 * 2, // 2 minutes ago
      tokenSymbol: "DEGEN",
      tokenAddress: "G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump",
      price: 0.000032,
      priceUSD: 0.000032,
      marketAddress: "chmhysfnnxeomt7sdlkabf5hqttvmtze8k4bohs2ph2y",
    },
    {
      id: "trade-2",
      timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
      tokenSymbol: "DEGEN",
      tokenAddress: "G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump",
      price: 0.000033,
      priceUSD: 0.000033,
      marketAddress: "chmhysfnnxeomt7sdlkabf5hqttvmtze8k4bohs2ph2y",
    },
    {
      id: "trade-3",
      timestamp: Date.now() - 1000 * 60 * 10, // 10 minutes ago
      tokenSymbol: "DEGEN",
      tokenAddress: "G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump",
      price: 0.000034,
      priceUSD: 0.000034,
      marketAddress: "chmhysfnnxeomt7sdlkabf5hqttvmtze8k4bohs2ph2y",
    },
  ]

  // Function to connect to WebSocket
  const connectWebSocket = () => {
    // In a real implementation, this would connect to a GraphQL subscription endpoint
    // For now, we'll simulate incoming data with a timer

    // Clear any existing connection
    if (wsRef.current) {
      wsRef.current.close()
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    // Simulate WebSocket connection with periodic updates
    const simulateConnection = () => {
      console.log("Simulating PumpFun WebSocket connection...")
      setIsLoading(false)

      // Set initial data
      if (trades.length === 0) {
        setTrades(mockTrades)
      }

      // Simulate receiving new trades every 15-30 seconds
      const interval = setInterval(
        () => {
          const randomPrice = 0.00003 + Math.random() * 0.000005
          const newTrade: Trade = {
            id: `trade-${Date.now()}`,
            timestamp: Date.now(),
            tokenSymbol: "DEGEN",
            tokenAddress: "G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump",
            price: randomPrice,
            priceUSD: randomPrice,
            marketAddress: "chmhysfnnxeomt7sdlkabf5hqttvmtze8k4bohs2ph2y",
          }

          setTrades((prevTrades) => [newTrade, ...prevTrades.slice(0, 9)]) // Keep only the 10 most recent trades
          setLastUpdated(new Date())
        },
        15000 + Math.random() * 15000,
      ) // Random interval between 15-30 seconds

      return interval
    }

    const interval = simulateConnection()

    // Store cleanup function
    return () => {
      clearInterval(interval)
    }
  }

  // Connect to WebSocket on component mount
  useEffect(() => {
    const cleanup = connectWebSocket()

    // Cleanup on unmount
    return () => {
      if (cleanup) cleanup()
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  // Format time ago
  const formatTimeAgo = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { addSuffix: true })
  }

  if (error) {
    return (
      <Card className="border-gray-800 bg-gray-900/50">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            <p>{error}</p>
            <button
              onClick={connectWebSocket}
              className="mt-2 px-4 py-2 bg-rat-primary text-white rounded-md text-sm flex items-center mx-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Reconnect
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-800 bg-gray-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Crown className="h-5 w-5 text-rat-gold mr-2" />
          PumpFun King of the Hill
          {!isLoading && (
            <Badge className="ml-auto bg-gray-800 text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated {formatTimeAgo(lastUpdated.getTime())}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-2 border-b border-gray-800">
                <Skeleton className="h-6 w-32 bg-gray-800" />
                <Skeleton className="h-6 w-24 bg-gray-800" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
            {trades.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No recent trades detected</p>
            ) : (
              trades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-2 border-b border-gray-800 hover:bg-gray-800/30 rounded-sm transition-colors"
                >
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium">{trade.tokenSymbol}</div>
                      <div className="text-xs text-gray-500">{formatTimeAgo(trade.timestamp)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium flex items-center">
                      <DollarSign className="h-3 w-3 text-rat-gold" />
                      {formatCurrency(trade.priceUSD)}
                    </div>
                    <div className="text-xs text-gray-500 truncate" style={{ maxWidth: "140px" }}>
                      {trade.marketAddress.slice(0, 8)}...
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        <div className="mt-3 text-center">
          <a
            href={PUMPFUN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-rat-primary hover:underline"
          >
            View on PumpFun
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export default PumpFunTracker
