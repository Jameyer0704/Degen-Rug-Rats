"use client"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { getNFTs, cancelNFTDataFetch, type NFT } from "@/lib/nft-service"

const NftGallery = () => {
  const [nftItems, setNftItems] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setIsLoading(true)
        const nfts = await getNFTs()
        setNftItems(nfts)
        setError(null)
      } catch (err) {
        console.error("Error fetching NFTs:", err)
        setError("Failed to load NFT data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNFTs()

    // Clean up function to cancel any ongoing fetches
    return () => {
      cancelNFTDataFetch()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="sewer-card border-gray-800 overflow-hidden">
            <div className="relative aspect-square bg-gray-800 animate-pulse"></div>
            <CardContent className="p-4">
              <div className="h-6 bg-gray-800 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-800 rounded animate-pulse w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-900 rounded-lg text-center">
        <p className="text-red-400">{error}</p>
        <p className="text-gray-400 text-sm mt-2">Please try again later.</p>
      </div>
    )
  }

  // Make sure nftItems is an array before mapping
  const items = Array.isArray(nftItems) ? nftItems : []

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((nft) => (
          <Card key={nft.id} className="sewer-card border-gray-800 overflow-hidden group">
            <div className="relative aspect-square overflow-hidden">
              {nft.image && (
                <Image
                  src={nft.image || "/placeholder.svg"}
                  alt={nft.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              )}
              <div className="absolute top-2 right-2">
                <Badge className="bg-rat-primary text-white border-none">{nft.price} SOL</Badge>
              </div>
              <div className="absolute top-2 left-2">
                <Badge className="bg-gray-900/80 backdrop-blur-sm text-white border-none">{nft.marketplace}</Badge>
              </div>
              {nft.isOneOfOne && (
                <div className="absolute bottom-2 left-2">
                  <Badge className="bg-rat-gold/80 text-black border-none">1:1 Special</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-orbitron font-bold text-lg mb-2">{nft.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Degen Rug-Rats</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-rat-primary text-rat-primary hover:bg-rat-primary/10"
                  onClick={() => window.open(nft.marketplaceUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default NftGallery
