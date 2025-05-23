export interface NFT {
  id: string
  name: string
  image: string
  price?: number
  collection: string
  marketplace: string
  marketplaceUrl: string
  isOneOfOne?: boolean
  floorPrice?: number
}

// Create a controller for NFT data fetches
let controller: AbortController | null = null

export async function getNFTs(): Promise<NFT[]> {
  // Cancel any previous requests
  if (controller) {
    try {
      controller.abort()
    } catch (err) {
      console.error("Error aborting previous NFT data fetch:", err)
    }
  }

  // Create a new controller for this request
  controller = new AbortController()

  try {
    // Real NFT data from the provided sources
    const nfts = [
      {
        id: "1",
        name: "Degen Rug-Rat #42",
        image: "/images/crypto-rat-crew.png",
        price: 0.42,
        collection: "Degen Rug-Rats",
        marketplace: "Magic Eden",
        marketplaceUrl: "https://magiceden.us/marketplace/DyzxDC6MerqLajQQqq3fMnMhLv6MQe8JFQ1gZL8TvRTP",
        floorPrice: 0.42,
        isOneOfOne: true,
      },
      {
        id: "2",
        name: "Degen Rug-Rat #69",
        image: "/images/street-rats-squad.png",
        price: 0.69,
        collection: "Degen Rug-Rats",
        marketplace: "Tensor",
        marketplaceUrl: "https://www.tensor.trade/trade/92078f42-23da-43e4-9fc6-74e9abb2c821",
        floorPrice: 0.42,
        isOneOfOne: true,
      },
      {
        id: "3",
        name: "Degen Rug-Rat #007",
        image: "/images/neon-rat-gang.png",
        price: 0.42,
        collection: "Degen Rug-Rats",
        marketplace: "LaunchMyNFT",
        marketplaceUrl: "https://launchmynft.io/sol/15827",
        floorPrice: 0.42,
        isOneOfOne: true,
      },
      {
        id: "4",
        name: "Degen Rug-Rat #13",
        image: "/images/bitcoin-rats.png",
        price: 0.42,
        collection: "Degen Rug-Rats",
        marketplace: "Magic Eden",
        marketplaceUrl: "https://magiceden.us/marketplace/DyzxDC6MerqLajQQqq3fMnMhLv6MQe8JFQ1gZL8TvRTP",
        floorPrice: 0.42,
        isOneOfOne: true,
      },
      {
        id: "5",
        name: "Degen Rug-Rat #420",
        image: "/images/crypto-winter-rats.png",
        price: 0.42,
        collection: "Degen Rug-Rats",
        marketplace: "Tensor",
        marketplaceUrl: "https://www.tensor.trade/trade/92078f42-23da-43e4-9fc6-74e9abb2c821",
        floorPrice: 0.42,
        isOneOfOne: true,
      },
      {
        id: "6",
        name: "Degen Rug-Rat #777",
        image: "/images/crypto-rat-boss.png",
        price: 0.42,
        collection: "Degen Rug-Rats",
        marketplace: "LaunchMyNFT",
        marketplaceUrl: "https://launchmynft.io/sol/15827",
        floorPrice: 0.42,
        isOneOfOne: true,
      },
    ]

    // Ensure no NFT has an empty image URL
    return nfts.map((nft) => ({
      ...nft,
      // If image is empty or undefined, provide a fallback
      image: nft.image || "/placeholder.svg",
    }))
  } catch (error) {
    console.error("Error fetching NFT data:", error)
    return []
  } finally {
    // Clear the controller reference
    controller = null
  }
}

// Function to cancel any ongoing NFT data fetches
export function cancelNFTDataFetch() {
  if (controller) {
    try {
      controller.abort()
      controller = null
    } catch (err) {
      console.error("Error cancelling NFT data fetch:", err)
    }
  }
}
