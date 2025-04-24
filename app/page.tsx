"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, Calendar, Bot, Sparkles, ExternalLink } from "lucide-react"
import AIChat from "@/components/ai-chat"
import { getTokenData } from "@/lib/token-service"
import { formatCurrency } from "@/lib/utils"
import { getNFTs } from "@/lib/nft-service"
import FAQAccordion from "@/components/faq-accordion"

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
  })
  const [nfts, setNfts] = useState([])
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

  return (
    <div>
      {/* Token Info Section - Now the Hero Section */}
      <section
        id="token"
        ref={tokenSectionRef}
        className="pt-24 pb-20 relative bg-black min-h-screen flex items-center"
      >
        <div className="absolute inset-0 opacity-20 z-0">
          <Image src="/images/sewer-bg.png" alt="Background" fill className="object-cover" />
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
              <Image src="/images/evil-rat-king.png" alt="$DEGEN Token" fill className="object-cover" />
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

        {/* Chat Widget */}
        {isChatOpen && (
          <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-gray-900 rounded-lg shadow-xl border border-gray-800 overflow-hidden">
            <AIChat isWidget={true} />
          </div>
        )}
      </section>

      {/* NFT Preview Section */}
      <section id="nfts" ref={nftSectionRef} className="py-20 bg-black/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              NFT <span className="text-rat-primary">Collection</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Explore our exclusive collection of Degen Rug-Rats NFTs - 69 standard editions and 20 rare 1:1 special
              editions
            </p>
          </div>

          <div className="mb-8 p-6 degen-card rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-orbitron font-bold mb-2">Collection Details</h3>
                <p className="text-gray-400 mb-4">
                  Our NFT collection features 69 standard Degen Rug-Rats and 20 exclusive 1:1 special editions. Each NFT
                  grants special benefits within our ecosystem including access to private Discord channels and future
                  airdrops.
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
      <section id="community" ref={communitySectionRef} className="py-20 bg-black">
        <div className="container mx-auto px-4">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="degen-card border-gray-800 overflow-hidden">
                      <div className="bg-[#5865F2] p-4">
                        <div className="text-white text-xl font-bold">Discord Community</div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-orbitron font-bold mb-2">Join Our Discord</h3>
                        <p className="text-gray-400 mb-4">
                          Join our Discord server to access exclusive content, token insights, and participate in
                          community events.
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-300">Growing community</span>
                          </div>
                          <Badge className="bg-green-500/20 text-green-500 border-none">Active</Badge>
                        </div>
                        <Button
                          className="w-full bg-[#5865F2] hover:bg-[#5865F2]/90 text-white"
                          onClick={() => window.open(DISCORD_URL, "_blank")}
                        >
                          Join Discord
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="degen-card border-gray-800 overflow-hidden">
                      <div className="bg-[#000000] p-4">
                        <div className="text-white text-xl font-bold">X Community</div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-orbitron font-bold mb-2">Follow Us on X</h3>
                        <p className="text-gray-400 mb-4">
                          Follow us on X (formerly Twitter) for the latest updates, announcements, and community
                          engagement.
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-300">Growing followers</span>
                          </div>
                          <Badge className="bg-green-500/20 text-green-500 border-none">Active</Badge>
                        </div>
                        <Button
                          className="w-full bg-[#000000] hover:bg-[#000000]/90 text-white"
                          onClick={() => window.open("https://x.com/MoandChi", "_blank")}
                        >
                          Follow on X
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="degen-card border-gray-800 overflow-hidden">
                      <div className="bg-[#0088cc] p-4">
                        <div className="text-white text-xl font-bold">Telegram Group</div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-orbitron font-bold mb-2">Join Telegram</h3>
                        <p className="text-gray-400 mb-4">
                          Our Telegram group is where we share real-time updates, trading signals, and community
                          discussions.
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-300">Active members</span>
                          </div>
                          <Badge className="bg-green-500/20 text-green-500 border-none">Active</Badge>
                        </div>
                        <Button
                          className="w-full bg-[#0088cc] hover:bg-[#0088cc]/90 text-white"
                          onClick={() => window.open("https://t.me/degenrugrats", "_blank")}
                        >
                          Join Telegram
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="degen-card border-gray-800 overflow-hidden md:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-lg">Trading Platforms</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold">Jupiter Exchange</h3>
                                <Badge className="bg-green-500/20 text-green-500 border-none">Active</Badge>
                              </div>
                              <p className="text-sm text-gray-400 mb-4">
                                The main DEX for trading $DEGEN with the highest liquidity.
                              </p>
                              <Button
                                size="sm"
                                className="w-full bg-rat-primary hover:bg-rat-primary/90"
                                onClick={() => window.open(BUY_TOKEN_URL, "_blank")}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Trade on Jupiter
                              </Button>
                            </CardContent>
                          </Card>

                          <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold">PumpFun</h3>
                                <Badge className="bg-green-500/20 text-green-500 border-none">Active</Badge>
                              </div>
                              <p className="text-sm text-gray-400 mb-4">
                                Alternative DEX for trading $DEGEN with competitive rates.
                              </p>
                              <Button
                                size="sm"
                                className="w-full bg-rat-primary hover:bg-rat-primary/90"
                                onClick={() => window.open(PUMPFUN_URL, "_blank")}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Trade on PumpFun
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <Card className="degen-card border-gray-800 sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg">Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left border-gray-700 hover:bg-gray-800 hover:text-white"
                          onClick={() => window.open(BUY_TOKEN_URL, "_blank")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-rat-primary/20 flex items-center justify-center">
                              <ExternalLink className="h-5 w-5 text-rat-primary" />
                            </div>
                            <div className="text-left">
                              <h4 className="font-bold">Jupiter Exchange</h4>
                              <p className="text-xs text-gray-400">Trade $DEGEN token</p>
                            </div>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start text-left border-gray-700 hover:bg-gray-800 hover:text-white"
                          onClick={() =>
                            window.open("https://www.tensor.trade/trade/92078f42-23da-43e4-9fc6-74e9abb2c821", "_blank")
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-rat-primary/20 flex items-center justify-center">
                              <ExternalLink className="h-5 w-5 text-rat-primary" />
                            </div>
                            <div className="text-left">
                              <h4 className="font-bold">Tensor</h4>
                              <p className="text-xs text-gray-400">NFT marketplace</p>
                            </div>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start text-left border-gray-700 hover:bg-gray-800 hover:text-white"
                          onClick={() =>
                            window.open(
                              "https://dexscreener.com/solana/chmhysfnnxeomt7sdlkabf5hqttvmtze8k4bohs2ph2y",
                              "_blank",
                            )
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-rat-primary/20 flex items-center justify-center">
                              <ExternalLink className="h-5 w-5 text-rat-primary" />
                            </div>
                            <div className="text-left">
                              <h4 className="font-bold">DexScreener</h4>
                              <p className="text-xs text-gray-400">Token price chart</p>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Token Burn Event",
                        date: "April 25, 2025",
                        image: "/images/evil-rat-king.png",
                        desc: "Join us for our first token burn event. We'll be reducing supply and discussing the tokenomics of the project.",
                        location: "Discord",
                      },
                      {
                        title: "Trading Workshop",
                        date: "May 10, 2025",
                        image: "/images/token-icon.png",
                        desc: "Learn advanced trading strategies from our community experts. Topics include technical analysis and risk management.",
                        location: "Telegram",
                      },
                      {
                        title: "NFT Drop",
                        date: "May 20, 2025",
                        image: "/images/hero-rats.png",
                        desc: "Exclusive NFT drop for community members. Get early access to our latest collection with special utilities.",
                        location: "Discord",
                      },
                      {
                        title: "AMA Session",
                        date: "June 5, 2025",
                        image: "/images/degen-sign.png",
                        desc: "Ask Me Anything session with the project team. Get your questions answered directly by the developers.",
                        location: "Twitter Spaces",
                      },
                    ].map((event, i) => (
                      <Card key={i} className="degen-card border-gray-800 overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <Badge className="bg-rat-primary text-white border-none mb-2">{event.date}</Badge>
                            <h3 className="text-xl font-orbitron font-bold text-white">{event.title}</h3>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                            <Calendar className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <p className="text-gray-300 text-sm">{event.desc}</p>
                          <Button className="w-full mt-4 bg-rat-primary hover:bg-rat-primary/90">RSVP</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Card className="degen-card border-gray-800 sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg">Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: "Token Burn Event", date: "Apr 25", type: "Community Event" },
                          { name: "Trading Workshop", date: "May 10", type: "Educational" },
                          { name: "NFT Drop", date: "May 20", type: "Launch" },
                          { name: "AMA Session", date: "Jun 5", type: "Q&A" },
                          { name: "Tokenomics Update", date: "Jun 15", type: "Announcement" },
                        ].map((event, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-rat-primary/20 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-rat-primary" />
                              </div>
                              <div>
                                <h4 className="font-bold">{event.name}</h4>
                                <p className="text-xs text-gray-400">{event.type}</p>
                              </div>
                            </div>
                            <div className="text-sm font-medium">{event.date}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-chat">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="degen-card border-gray-800 h-[600px] flex flex-col">
                    <AIChat />
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
                          <span className="text-sm">Active community on Discord and Telegram</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-rat-primary/20 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-rat-primary rounded-full"></div>
                          </div>
                          <span className="text-sm">Regular token updates and community events</span>
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

                  <Card className="degen-card border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-lg">Common Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FAQAccordion
                        items={[
                          {
                            question: "What is the $DEGEN token?",
                            answer:
                              "$DEGEN is our community token on the Solana blockchain with a total supply of 1 billion tokens. It's designed for true degens who want to be part of our underground crypto community. The token gives holders access to exclusive content, early NFT drops, and community events.",
                          },
                          {
                            question: "Where can I buy the token?",
                            answer: `You can buy $DEGEN on Jupiter Exchange or PumpFun. The token contract address is G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump. We recommend using Jupiter for the best rates and liquidity.`,
                          },
                          {
                            question: "How do I join the community?",
                            answer: `Join our Discord at ${DISCORD_URL} and Telegram channels to connect with fellow Degen Rug-Rats. Our community is active 24/7 with discussions about the token, NFTs, and general crypto alpha. We also host regular events and giveaways for community members.`,
                          },
                          {
                            question: "Tell me about the NFT collection",
                            answer:
                              "Our NFT collection features 89 unique Degen Rug-Rats - 69 standard editions and 20 exclusive 1:1 special editions. Each NFT grants special benefits including access to private Discord channels, token airdrops, and future metaverse access. The mint price is 0.1 SOL per NFT.",
                          },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" ref={roadmapSectionRef} className="py-20 bg-black/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Project <span className="text-rat-primary">Roadmap</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our journey through the sewers - past achievements and future plans for the Degen Rug-Rats ecosystem
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-800 z-0"></div>

            <div className="relative z-10 space-y-12 md:space-y-24">
              {/* Q1 2025 - Completed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="md:text-right">
                  <Badge className="mb-2 bg-green-500/20 text-green-500 border-none">Completed</Badge>
                  <h3 className="text-2xl font-orbitron font-bold mb-2">Q1 2025</h3>
                  <p className="text-gray-400 mb-4">Project launch and initial community building</p>

                  <Card className="sewer-card border-gray-800 overflow-hidden">
                    <CardContent className="p-4">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2 md:flex-row-reverse">
                          <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span>Token contract development and audit</span>
                        </li>
                        <li className="flex items-start gap-2 md:flex-row-reverse">
                          <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span>Website launch and branding</span>
                        </li>
                        <li className="flex items-start gap-2 md:flex-row-reverse">
                          <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span>Community channels setup</span>
                        </li>
                        <li className="flex items-start gap-2 md:flex-row-reverse">
                          <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span>Token launch on DEXs</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="relative">
                  <div className="absolute left-0 md:left-auto md:right-full top-1/2 transform -translate-y-1/2 md:-translate-x-8 w-8 h-8 bg-green-500 rounded-full border-4 border-black z-20"></div>
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image src="/images/logo-banner.png" alt="Q1 2025" fill className="object-cover" />
                  </div>
                </div>
              </div>

              {/* Q2 2025 - In Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="md:order-2">
                  <Badge className="mb-2 bg-rat-primary/20 text-rat-primary border-none">In Progress</Badge>
                  <h3 className="text-2xl font-orbitron font-bold mb-2">Q2 2025</h3>
                  <p className="text-gray-400 mb-4">NFT collection launch and ecosystem expansion</p>

                  <Card className="sewer-card border-gray-800 overflow-hidden">
                    <CardContent className="p-4">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="bg-green-500/20 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span>Initial marketing campaign</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="bg-rat-primary/20 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-rat-primary rounded-full"></div>
                          </div>
                          <span className="font-bold">NFT collection mint (Currently Active)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="bg-rat-primary/20 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-rat-primary rounded-full"></div>
                          </div>
                          <span>69 standard NFTs + 20 1:1 special editions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="bg-gray-700 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          </div>
                          <span>Token staking platform launch</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="relative md:order-1">
                  <div className="absolute left-0 md:left-full top-1/2 transform -translate-y-1/2 md:translate-x-8 w-8 h-8 bg-rat-primary rounded-full border-4 border-black z-20"></div>
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Flux_Dev_A_vibrant_digital_art_collection_of_anthropomorphic_r_3.jpg-j34k754kkuTNI4omEaIq3DE4Etkkrf.jpeg"
                      alt="Q2 2025"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Q3 2025 - Upcoming */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="md:text-right">
                  <Badge className="mb-2 bg-gray-700 text-gray-300 border-none">Upcoming</Badge>
                  <h3 className="text-2xl font-orbitron font-bold mb-2">Q3 2025</h3>
                  <p className="text-gray-400 mb-4">Ecosystem expansion and partnerships</p>

                  <Card className="sewer-card border-gray-800 overflow-hidden">
                    <CardContent className="p-4">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2 md:flex-row-reverse">
                          <div className="bg-gray-700 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          </div>
                          <span>NFT marketplace launch</span>
                        </li>
                        <li className="flex items-start gap-2 md:flex-row-reverse">
                          <div className="bg-gray-700 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          </div>
                          <span>AI-powered trading tools</span>
                        </li>
                        <li className="flex items-start gap-2 md:flex-row-reverse">
                          <div className="bg-gray-700 p-1 rounded-full mt-0.5">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          </div>
                          <span>Strategic partnerships</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="relative">
                  <div className="absolute left-0 md:left-auto md:right-full top-1/2 transform -translate-y-1/2 md:-translate-x-8 w-8 h-8 bg-gray-700 rounded-full border-4 border-black z-20"></div>
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Flux_Dev_A_vibrant_digital_art_collection_of_anthropomorphic_r_0.jpg-VhbeL5ShxxS9p5adRj2p5SaBZGmBTS.jpeg"
                      alt="Q3 2025"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-sm p-8 md:p-12 border border-gray-800 max-w-4xl mx-auto">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-rat-primary/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-rat-neon/20 blur-3xl"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">
                Ready to go <span className="text-rat-primary">Full Degen</span>?
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto mb-8">
                Join the Degen Rug-Rats community today and get early access to token presales, NFT drops, and exclusive
                alpha.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  className="bg-rat-primary hover:bg-rat-primary/90 text-white font-orbitron"
                  onClick={() => window.open(BUY_TOKEN_URL, "_blank")}
                >
                  Buy $DEGEN Token
                </Button>
                <Button
                  variant="outline"
                  className="border-rat-neon text-rat-neon hover:bg-rat-neon/10"
                  onClick={() => window.open(DISCORD_URL, "_blank")}
                >
                  Join Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
