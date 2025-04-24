"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, Calendar, Bot, Sparkles, ExternalLink, DiscIcon as Discord, Twitter } from "lucide-react"
import AIChat from "@/components/ai-chat"
import { getTokenData } from "@/lib/token-service"
import { formatCurrency } from "@/lib/utils"
import { getNFTs } from "@/lib/nft-service"
import { Badge } from "@/components/ui/badge"

// Token contract address
const TOKEN_CONTRACT = "G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump"
const BUY_TOKEN_URL = `https://jup.ag/swap/SOL-${TOKEN_CONTRACT}`
const PUMPFUN_URL = `https://pump.fun/coin/${TOKEN_CONTRACT}`
const DISCORD_URL = "https://discord.gg/TnHKnJKP5w"

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [tokenData, setTokenData] = useState({
    price: 0,
    priceChange24h: 0,
    volume24h: 0,
    liquidity: 0,
    marketCap: 0,
    tokenSymbol: "DEGEN",
    totalSupply: 1000000000,
    maxSupply: 1000000000,
    burnedSupply: 0,
    holders: 24,
  })
  const [nfts, setNfts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Refs for section navigation
  const tokenSectionRef = useRef(null)
  const nftSectionRef = useRef(null)
  const communitySectionRef = useRef(null)
  const roadmapSectionRef = useRef(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const [tokenDataResult, nftDataResult] = await Promise.all([getTokenData(), getNFTs()])

        setTokenData(tokenDataResult)
        setNfts(nftDataResult.slice(0, 4)) // Just get the first 4 NFTs for the homepage
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Check for hash in URL and scroll to that section
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [])

  // Inline styles for the floating chat widget
  const floatingChatStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "96px",
    right: "24px",
    zIndex: 50,
    width: "350px",
    maxWidth: "90vw",
    maxHeight: "70vh",
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
    border: "1px solid #333",
    overflow: "hidden",
    display: isChatOpen ? "block" : "none",
  }

  return (
    <div>
      {/* Token Info Section - Now the Hero Section */}
      <section
        id="token"
        ref={tokenSectionRef}
        className="pt-24 pb-20 relative bg-black min-h-screen flex items-center"
      >
        <div className="absolute inset-0 opacity-20 z-0">
          <Image
            src="/images/sewer-bg.png"
            alt="Sewer Background"
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <Image
                  src="/images/degen-logo.png"
                  alt="Degen Rug-Rats"
                  width={400}
                  height={150}
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">
                <span className="text-rat-primary">$DEGEN</span> Token
              </h2>
              <p className="text-gray-400 mb-8">
                The most underground token on Solana - built for true degens, by true degens. Join our community and get
                access to exclusive alpha.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Current Price</p>
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold">{formatCurrency(tokenData.price)}</span>
                    <span
                      className={`ml-2 text-xs ${tokenData.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {tokenData.priceChange24h >= 0 ? "+" : ""}
                      {tokenData.priceChange24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Market Cap</p>
                  <p className="font-bold">{formatCurrency(tokenData.marketCap)}</p>
                </div>
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">24h Volume</p>
                  <p className="font-bold">{formatCurrency(tokenData.volume24h)}</p>
                </div>
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Total Supply</p>
                  <p className="font-bold">{tokenData.totalSupply.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="bg-rat-primary hover:bg-rat-primary/90 text-white flex-1"
                  onClick={() => window.open(BUY_TOKEN_URL, "_blank")}
                >
                  Buy on Jupiter
                </Button>
                <Button
                  variant="outline"
                  className="border-rat-neon text-rat-neon hover:bg-rat-neon/10 flex-1"
                  onClick={() => window.open(PUMPFUN_URL, "_blank")}
                >
                  Buy on PumpFun
                </Button>
              </div>
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden shadow-[0_0_30px_rgba(255,87,87,0.3)]">
              <Image
                src="/images/crypto-rat-boss.png"
                alt="$DEGEN Token"
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
            </div>
          </div>
        </div>

        {/* Floating Chat Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`rounded-full w-14 h-14 p-0 ${
              isChatOpen ? "bg-red-500 hover:bg-red-600" : "bg-rat-primary hover:bg-rat-primary/90"
            }`}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>

        {/* Chat Widget with inline styles */}
        <div style={floatingChatStyle}>
          <AIChat isWidget={true} tokenData={tokenData} />
        </div>
      </section>

      {/* NFT Preview Section */}
      <section id="nfts" ref={nftSectionRef} className="py-20 relative bg-black/80">
        {/* Different sewer background for NFT section */}
        <div className="absolute inset-0 opacity-20 z-0">
          <Image
            src="/images/sewer-tunnel.jpg"
            alt="Sewer Tunnel"
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              NFT <span className="text-rat-primary">Collection</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Explore our exclusive collection of Degen Rug-Rats NFTs - 69 standard editions and 20 rare 1:1 special
              editions
            </p>
          </div>

          {/* NFT Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg group">
              <Image
                src="/images/crypto-rat-crew.png"
                alt="Degen Rug-Rats NFT"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-orbitron text-lg">Crypto Rat Crew</h3>
                  <p className="text-gray-300 text-sm">1:1 Special Edition</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg group">
              <Image
                src="/images/street-rats-squad.png"
                alt="Degen Rug-Rats NFT"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-orbitron text-lg">Street Rats Squad</h3>
                  <p className="text-gray-300 text-sm">1:1 Special Edition</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg group">
              <Image
                src="/images/neon-rat-gang.png"
                alt="Degen Rug-Rats NFT"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-orbitron text-lg">Neon Rat Gang</h3>
                  <p className="text-gray-300 text-sm">1:1 Special Edition</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 degen-card rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-orbitron font-bold mb-2">Collection Details</h3>
                <p className="text-gray-400 mb-4">
                  Our NFT collection features 69 standard Degen Rug-Rats and 20 exclusive 1:1 special editions. Each NFT
                  grants special benefits within our ecosystem including access to private Discord channels, future
                  airdrops, and early access to our premium AI tools.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Total Supply</p>
                    <p className="font-bold">89 NFTs</p>
                  </div>
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Standard Edition</p>
                    <p className="font-bold">69 NFTs</p>
                  </div>
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Special 1:1s</p>
                    <p className="font-bold">20 NFTs</p>
                  </div>
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Mint Price</p>
                    <p className="font-bold">0.1 SOL</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="border-rat-primary text-rat-primary hover:bg-rat-primary/10"
                  onClick={() =>
                    window.open("https://www.tensor.trade/trade/92078f42-23da-43e4-9fc6-74e9abb2c821", "_blank")
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Tensor
                </Button>
                <Button
                  variant="outline"
                  className="border-rat-primary text-rat-primary hover:bg-rat-primary/10"
                  onClick={() =>
                    window.open(
                      "https://magiceden.us/marketplace/DyzxDC6MerqLajQQqq3fMnMhLv6MQe8JFQ1gZL8TvRTP",
                      "_blank",
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Magic Eden
                </Button>
                <Button
                  variant="outline"
                  className="border-rat-primary text-rat-primary hover:bg-rat-primary/10"
                  onClick={() => window.open("https://launchmynft.io/sol/15827", "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  LaunchMyNFT
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button
              className="bg-rat-primary hover:bg-rat-primary/90 text-white"
              onClick={() => window.open("https://launchmynft.io/sol/15827", "_blank")}
            >
              Mint Your Degen Rug-Rat
            </Button>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" ref={communitySectionRef} className="py-20 relative bg-black">
        {/* Different sewer background for community section */}
        <div className="absolute inset-0 opacity-25 z-0 overflow-hidden">
          <div className="absolute inset-0 rotate-180">
            <Image
              src="/images/sewer-bg.png"
              alt="Sewer Background"
              fill
              className="object-cover object-bottom"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Degen Rug-Rats <span className="text-rat-primary">Community</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Connect with fellow rats, get the latest alpha, and participate in community events
            </p>
          </div>

          <Tabs defaultValue="social" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-900 border border-gray-800">
                <TabsTrigger
                  value="social"
                  className="data-[state=active]:bg-rat-primary data-[state=active]:text-white"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Social
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="data-[state=active]:bg-rat-primary data-[state=active]:text-white"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Events
                </TabsTrigger>
                <TabsTrigger
                  value="ai-chat"
                  className="data-[state=active]:bg-rat-primary data-[state=active]:text-white"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with SewerKing
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="social">
              <div className="space-y-6">
                <p className="text-gray-400 text-center max-w-2xl mx-auto">
                  Connect with the Degen Rug-Rats community on various social platforms. Join our underground movement
                  and get the latest alpha.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Discord Card */}
                  <Card className="border-0 overflow-hidden bg-gradient-to-br from-[#5865F2]/20 to-[#5865F2]/5 shadow-lg shadow-[#5865F2]/10">
                    <CardContent className="p-0">
                      <div className="bg-[#5865F2] p-4 flex justify-between items-center">
                        <h3 className="text-white font-orbitron text-lg">Discord</h3>
                        <Discord className="h-6 w-6 text-white" />
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Members</span>
                          <span className="text-xl font-bold text-white">18</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Channels</span>
                          <span className="text-xl font-bold text-white">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Alpha Channels</span>
                          <span className="text-xl font-bold text-white">4</span>
                        </div>
                        <Button
                          className="w-full bg-[#5865F2] hover:bg-[#5865F2]/90 text-white mt-4"
                          onClick={() => window.open("https://discord.gg/TnHKnJKP5w", "_blank")}
                        >
                          <Discord className="h-5 w-5 mr-2" />
                          Join Discord
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* X (Twitter) Card - Now in black and white */}
                  <Card className="border-0 overflow-hidden bg-gradient-to-br from-gray-800/30 to-gray-900/20 shadow-lg shadow-black/20">
                    <CardContent className="p-0">
                      <div className="bg-black p-4 flex justify-between items-center">
                        <h3 className="text-white font-orbitron text-lg">X</h3>
                        <Twitter className="h-6 w-6 text-white" />
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Followers</span>
                          <span className="text-xl font-bold text-white">42</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Posts</span>
                          <span className="text-xl font-bold text-white">69</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Alpha Posts</span>
                          <span className="text-xl font-bold text-white">24</span>
                        </div>
                        <Button
                          className="w-full bg-black hover:bg-gray-900 text-white mt-4"
                          onClick={() => window.open("https://x.com/MoandChi", "_blank")}
                        >
                          <Twitter className="h-5 w-5 mr-2" />
                          Follow on X
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Telegram Card */}
                  <Card className="border-0 overflow-hidden bg-gradient-to-br from-[#0088cc]/20 to-[#0088cc]/5 shadow-lg shadow-[#0088cc]/10">
                    <CardContent className="p-0">
                      <div className="bg-[#0088cc] p-4 flex justify-between items-center">
                        <h3 className="text-white font-orbitron text-lg">Telegram</h3>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.963-1.358 6.585-.165.673-.32 1.797-.878 1.797-.558 0-.782-.516-1.243-.956-.69-.658-1.083-1.056-1.757-1.707-.777-.738-.273-1.14.169-1.8.116-.174 2.145-1.958 2.182-2.124.005-.021.009-.103-.039-.146-.048-.044-.117-.03-.168-.018-.071.018-1.204.752-3.397 2.204-.322.209-.613.311-.874.306-.288-.005-.839-.155-1.25-.284-.506-.158-.908-.24-.872-.506.018-.133.193-.27.526-.41 2.071-.878 3.45-1.457 4.14-1.737 1.967-.798 2.376-.935 2.643-.935.059 0 .188.013.272.073.07.05.089.116.099.166.014.088.023.18.012.274z" />
                        </svg>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Members</span>
                          <span className="text-xl font-bold text-white">36</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Daily Messages</span>
                          <span className="text-xl font-bold text-white">420</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Alpha Signals</span>
                          <span className="text-xl font-bold text-white">15</span>
                        </div>
                        <Button
                          className="w-full bg-[#0088cc] hover:bg-[#0088cc]/90 text-white mt-4"
                          onClick={() => window.open("https://t.me/degenrugrats", "_blank")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.963-1.358 6.585-.165.673-.32 1.797-.878 1.797-.558 0-.782-.516-1.243-.956-.69-.658-1.083-1.056-1.757-1.707-.777-.738-.273-1.14.169-1.8.116-.174 2.145-1.958 2.182-2.124.005-.021.009-.103-.039-.146-.048-.044-.117-.03-.168-.018-.071.018-1.204.752-3.397 2.204-.322.209-.613.311-.874.306-.288-.005-.839-.155-1.25-.284-.506-.158-.908-.24-.872-.506.018-.133.193-.27.526-.41 2.071-.878 3.45-1.457 4.14-1.737 1.967-.798 2.376-.935 2.643-.935.059 0 .188.013.272.073.07.05.089.116.099.166.014.088.023.18.012.274z" />
                          </svg>
                          Join Telegram
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="sewer-card border-gray-800 overflow-hidden mt-8">
                  <CardContent className="p-0">
                    <div className="p-4 border-b border-gray-800">
                      <h4 className="font-orbitron font-bold">Community Overview</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-800">
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-rat-primary">96</p>
                        <p className="text-gray-400 text-sm">Total Members</p>
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-rat-secondary">24</p>
                        <p className="text-gray-400 text-sm">Token Holders</p>
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-rat-gold">12</p>
                        <p className="text-gray-400 text-sm">NFT Holders</p>
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-500">7</p>
                        <p className="text-gray-400 text-sm">Active Mods</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="space-y-4">
                <p className="text-gray-400">
                  Stay updated with upcoming community events, token launches, and NFT drops.
                </p>

                <div className="space-y-3">
                  {[
                    {
                      title: "First RugPull",
                      date: "April 25-26, 2025",
                      desc: "Join us for our first community RugPull event. Learn the art of the pull and how to spot the next victim.",
                    },
                    {
                      title: "Sewer Raid",
                      date: "May 10, 2025",
                      desc: "Coordinated buying event to pump the token. Bring your SOL and your degen energy.",
                    },
                    {
                      title: "Sniper Bot V1 Release",
                      date: "May 20, 2025",
                      desc: "Unveiling our newest AI Solana Trading Bot. Get early access to automated trading strategies and market insights.",
                    },
                  ].map((event, i) => (
                    <Card key={i} className="sewer-card border-gray-800">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-orbitron font-bold text-white">{event.title}</h4>
                            <p className="text-gray-400 text-sm mt-1">{event.desc}</p>
                          </div>
                          <Badge className="bg-rat-primary/20 text-rat-primary border-none">{event.date}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-chat">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="degen-card border-gray-800 h-[600px] flex flex-col">
                    <AIChat tokenData={tokenData} />
                  </Card>
                </div>

                <div>
                  <Card className="degen-card border-gray-800 mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="h-5 w-5 text-rat-primary" />
                        Project Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="bg-rat-primary/20 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-rat-primary rounded-full"></div>
                          </div>
                          <span className="text-sm">$DEGEN token on Solana blockchain</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-rat-primary/20 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-rat-primary rounded-full"></div>
                          </div>
                          <span className="text-sm">89 NFTs (69 standard, 20 1:1 special editions)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-rat-primary/20 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-rat-primary rounded-full"></div>
                          </div>
                          <span className="text-sm">NFTs provide early access to premium AI tools</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-rat-primary/20 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-rat-primary rounded-full"></div>
                          </div>
                          <span className="text-sm">Active community on Discord and X</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button
                          className="w-full bg-rat-primary/20 text-rat-primary hover:bg-rat-primary/30"
                          onClick={() => window.open(BUY_TOKEN_URL, "_blank")}
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Buy $DEGEN Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" ref={roadmapSectionRef} className="py-20 relative bg-black/90">
        <div className="absolute inset-0 opacity-15 z-0">
          <Image
            src="/images/sewer-bg.png"
            alt="Sewer Background"
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Project <span className="text-rat-primary">Roadmap</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our journey from the sewers to the moon - follow our development roadmap
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phase 1 */}
            <Card className="sewer-card border-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-rat-primary/10 p-4 border-b border-gray-800">
                  <h3 className="font-orbitron font-bold text-rat-primary flex items-center">
                    <Badge className="bg-green-500 text-white border-none mr-2">Completed</Badge>
                    Phase 1: Foundation
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300">Token launch on Solana</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300">Website development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300">Community building</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300">Social media presence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300">Initial marketing campaign</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2 */}
            <Card className="sewer-card border-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-rat-primary/10 p-4 border-b border-gray-800">
                  <h3 className="font-orbitron font-bold text-rat-primary flex items-center">
                    <Badge className="bg-yellow-500 text-black border-none mr-2">In Progress</Badge>
                    Phase 2: Expansion
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="bg-yellow-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300">NFT collection launch (69 standard + 20 special)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-yellow-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300">AI trading tools development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-yellow-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300">Staking platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-gray-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-400">Strategic partnerships</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-gray-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-400">Exchange listings</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Phase 3 */}
            <Card className="sewer-card border-gray-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-rat-primary/10 p-4 border-b border-gray-800">
                  <h3 className="font-orbitron font-bold text-rat-primary flex items-center">
                    <Badge className="bg-gray-500 text-white border-none mr-2">Upcoming</Badge>
                    Phase 3: Domination
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="bg-gray-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-400">Metaverse integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-gray-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-400">DEX launch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-gray-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-400">Cross-chain expansion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-gray-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-400">DAO governance implementation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-gray-500/20 p-1 rounded-full mt-0.5">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-400">Global marketing campaign</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
