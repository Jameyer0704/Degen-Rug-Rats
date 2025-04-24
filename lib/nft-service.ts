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
    return [
      {
        id: "1",
        name: "Degen Rug-Rat #42",
        image:
          "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/Oc5I9oi-GBxU5UQVNOkiIQbfoYOcYA9P-NbJcRZDYSA",
        price: 0.42,
        collection: "Degen Rug-Rats",
        marketplace: "Magic Eden",
        marketplaceUrl: "https://magiceden.us/marketplace/DyzxDC6MerqLajQQqq3fMnMhLv6MQe8JFQ1gZL8TvRTP",
        floorPrice: 0.42,
      },
      {
        id: "2",
        name: "Degen Rug-Rat #69",
        image:
          "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/Oc5I9oi-GBxU5UQVNOkiIQbfoYOcYA9P-NbJcRZDYSA",
        price: 0.69,
        collection: "Degen Rug-Rats",
        marketplace: "Tensor",
        marketplaceUrl: "https://www.tensor.trade/trade/92078f42-23da-43e4-9fc6-74e9abb2c821",
        floorPrice: 0.42,
      },
      {
        id: "3",
        name: "Degen Rug-Rat #007",
        image:
          "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/Oc5I9oi-GBxU5UQVNOkiIQbfoYOcYA9P-NbJcRZDYSA",
        price: 0.42,
        collection: "Degen Rug-Rats",
        marketplace: "LaunchMyNFT",
        marketplaceUrl: "https://launchmynft.io/sol/15827",
        floorPrice: 0.42,
      },
      {
        id: "4",
        name: "Degen Rug-Rat #13",
        image:
          "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/Oc5I9oi-GBxU5UQVNOkiIQbfoYOcYA9P-NbJcRZDYSA",
        price: 0.42,
        collection: "Degen Rug-Rats",
        marketplace: "Magic Eden",
        marketplaceUrl: "https://magiceden.us/marketplace/DyzxDC6MerqLajQQqq3fMnMhLv6MQe8JFQ1gZL8TvRTP",
        floorPrice: 0.42,
      },
      {
        id: "5",
        name: "Degen Rug-Rat #420",
        image:
          "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/Oc5I9oi-GBxU5UQVNOkiIQbfoYOcYA9P-NbJcRZDYSA",
        price: 0.42,
        collection: "Degen Rug-Rats",
        marketplace: "Tensor",
        marketplaceUrl: "https://www.tensor.trade/trade/92078f42-23da-43e4-9fc6-74e9abb2c821",
        floorPrice: 0.42,
      },
      {
        id: "6",
        name: "Degen Rug-Rat #777",
        image:
          "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/Oc5I9oi-GBxU5UQVNOkiIQbfoYOcYA9P-NbJcRZDYSA",
        price: 0.42,
        collection: "Degen Rug-Rats",
        marketplace: "LaunchMyNFT",
        marketplaceUrl: "https://launchmynft.io/sol/15827",
        floorPrice: 0.42,
      },
    ]
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
