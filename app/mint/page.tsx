"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import MintButton from "@/components/mint-button"

export default function MintPage() {
  useEffect(() => {
    // No longer defining global variables or including script tags here
  }, [])

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-2">
            Mint Your <span className="text-rat-primary">Degen Rug-Rat</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join the underground by minting your exclusive Degen Rug-Rats NFT. Each NFT grants special utility within
            our ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden mb-6">
              <Image
                src="/images/hero-rats.png"
                alt="Degen Rug-Rats NFT Collection"
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/images/street-rats-1.png"
                  alt="NFT Preview 1"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/images/crypto-rats.png"
                  alt="NFT Preview 2"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/images/chain-rat.png"
                  alt="NFT Preview 3"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <Card className="sewer-card border-gray-800">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-orbitron font-bold mb-2">Mint Details</h2>
                    <p className="text-gray-400">
                      Mint your exclusive Degen Rug-Rats NFT and join our underground community. Each NFT is unique and
                      grants special benefits.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 rounded-lg p-4">
                      <p className="text-gray-400 text-xs mb-1">Price</p>
                      <p className="font-bold">1.5 SOL</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <p className="text-gray-400 text-xs mb-1">Total Supply</p>
                      <p className="font-bold">5,000</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <p className="text-gray-400 text-xs mb-1">Max Per Wallet</p>
                      <p className="font-bold">5</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <p className="text-gray-400 text-xs mb-1">Blockchain</p>
                      <p className="font-bold">Solana</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    <h3 className="font-orbitron font-bold mb-3">NFT Benefits</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="bg-rat-primary/20 p-1 rounded-full mt-0.5">
                          <div className="w-2 h-2 bg-rat-primary rounded-full"></div>
                        </div>
                        <span className="text-gray-300">Access to exclusive community areas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-rat-primary/20 p-1 rounded-full mt-0.5">
                          <div className="w-2 h-2 bg-rat-primary rounded-full"></div>
                        </div>
                        <span className="text-gray-300">$DRR token airdrops for holders</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-rat-primary/20 p-1 rounded-full mt-0.5">
                          <div className="w-2 h-2 bg-rat-primary rounded-full"></div>
                        </div>
                        <span className="text-gray-300">Voting rights in DAO governance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-rat-primary/20 p-1 rounded-full mt-0.5">
                          <div className="w-2 h-2 bg-rat-primary rounded-full"></div>
                        </div>
                        <span className="text-gray-300">Metaverse access when launched</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <MintButton />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
