"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown, DollarSign, BarChart3, Activity, Users } from "lucide-react"
import { getTokenData, cancelTokenDataFetch, type TokenData } from "@/lib/token-service"
import { formatCurrency } from "@/lib/utils"

const TokenStats = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<TokenData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const tokenData = await getTokenData()
        setStats(tokenData)
        setError(null)
      } catch (err) {
        console.error("Error fetching token data:", err)
        setError("Unable to fetch token data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up polling to refresh data every 60 seconds
    const intervalId = setInterval(fetchData, 60000)

    // Clean up function to cancel any ongoing fetches and clear the interval
    return () => {
      clearInterval(intervalId)
      cancelTokenDataFetch()
    }
  }, [])

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-900 rounded-lg text-center">
        <p className="text-red-400">{error}</p>
        <p className="text-gray-400 text-sm mt-2">Check back later for updated token information.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card className="sewer-card border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Price</h3>
            <DollarSign className="h-4 w-4 text-rat-gold" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 bg-gray-800" />
          ) : (
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white">{formatCurrency(stats?.price || 0)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="sewer-card border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">24h Change</h3>
            <Activity className="h-4 w-4 text-rat-gold" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 bg-gray-800" />
          ) : (
            <div className="flex items-baseline">
              <span
                className={`text-2xl font-bold ${(stats?.priceChange24h || 0) >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {(stats?.priceChange24h || 0) >= 0 ? "+" : ""}
                {stats?.priceChange24h || 0}%
              </span>
              {(stats?.priceChange24h || 0) >= 0 ? (
                <ArrowUp className="ml-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="ml-1 h-4 w-4 text-red-500" />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="sewer-card border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Market Cap</h3>
            <BarChart3 className="h-4 w-4 text-rat-gold" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 bg-gray-800" />
          ) : (
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white">{formatCurrency(stats?.marketCap || 0)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="sewer-card border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">24h Volume</h3>
            <Activity className="h-4 w-4 text-rat-gold" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 bg-gray-800" />
          ) : (
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white">{formatCurrency(stats?.volume24h || 0)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="sewer-card border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Liquidity</h3>
            <Users className="h-4 w-4 text-rat-gold" />
          </div>
          {loading ? (
            <Skeleton className="h-8 w-24 bg-gray-800" />
          ) : (
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white">{formatCurrency(stats?.liquidity || 0)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const PUMPFUN_URL = "https://pump.fun/coin/G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump"

export default TokenStats
