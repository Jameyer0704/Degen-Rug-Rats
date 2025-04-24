export interface TokenData {
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
  tokenSymbol: string
  totalSupply: number
  maxSupply: number
  burnedSupply: number
  pairAddress: string
}

// Create a controller for token data fetches
let controller: AbortController | null = null

export const PUMPFUN_URL = "https://pump.fun/coin/G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump"

export async function getTokenData(): Promise<TokenData> {
  // Cancel any previous requests
  if (controller) {
    try {
      controller.abort()
    } catch (err) {
      console.error("Error aborting previous token data fetch:", err)
    }
  }

  // Create a new controller for this request
  controller = new AbortController()

  try {
    // Fetch data from DexScreener API for the token
    const response = await fetch(
      "https://api.dexscreener.com/latest/dex/pairs/solana/chmhysfnnxeomt7sdlkabf5hqttvmtze8k4bohs2ph2y",
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
        signal: controller.signal,
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch token data: ${response.status}`)
    }

    const data = await response.json()

    // Extract the relevant data from the response
    const pair = data.pairs?.[0]

    if (!pair) {
      throw new Error("No pair data found")
    }

    // Use the correct total supply from the project
    const totalSupply = 1000000000 // 1 billion tokens
    const maxSupply = 1000000000
    const burnedSupply = 42000000 // Adjust as needed

    return {
      price: Number.parseFloat(pair.priceUsd || "0"),
      priceChange24h: Number.parseFloat(pair.priceChange?.h24 || "0"),
      volume24h: Number.parseFloat(pair.volume?.h24 || "0"),
      liquidity: Number.parseFloat(pair.liquidity?.usd || "0"),
      marketCap: Number.parseFloat(pair.fdv || "0"),
      tokenSymbol: pair.baseToken?.symbol || "DEGEN",
      totalSupply: totalSupply,
      maxSupply: maxSupply,
      burnedSupply: burnedSupply,
      pairAddress: pair.pairAddress || "",
    }
  } catch (error) {
    console.error("Error fetching token data:", error)

    // Return fallback data on error
    return {
      price: 0.00000123,
      priceChange24h: 5.2,
      volume24h: 15000,
      liquidity: 25000,
      marketCap: 38000,
      tokenSymbol: "DEGEN",
      totalSupply: 1000000000,
      maxSupply: 1000000000,
      burnedSupply: 42000000,
      pairAddress: "chmhysfnnxeomt7sdlkabf5hqttvmtze8k4bohs2ph2y",
    }
  } finally {
    // Clear the controller reference
    controller = null
  }
}

// Function to cancel any ongoing token data fetches
export function cancelTokenDataFetch() {
  if (controller) {
    try {
      controller.abort()
      controller = null
    } catch (err) {
      console.error("Error cancelling token data fetch:", err)
    }
  }
}
