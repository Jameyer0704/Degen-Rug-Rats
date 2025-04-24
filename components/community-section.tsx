"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, Calendar, DiscIcon as Discord, Twitter, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import AIChat from "@/components/ai-chat"
import PumpFunTracker from "@/components/pumpfun-tracker"
import { cancelAllChatRequests } from "@/lib/ai-service"

// New token contract address
const TOKEN_CONTRACT = "G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump"
const BUY_TOKEN_URL = `https://jup.ag/swap/SOL-${TOKEN_CONTRACT}`

const CommunitySection = () => {
  const [activeTab, setActiveTab] = useState("chat")
  const isMounted = useRef(true)

  // Clean up any pending AI requests when component unmounts
  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
      try {
        cancelAllChatRequests()
      } catch (err) {
        console.error("Error during cleanup:", err)
      }
    }
  }, [])

  const communityFeatures = [
    {
      id: "chat",
      icon: <MessageSquare className="h-5 w-5" />,
      title: "AI Chat",
      content: (
        <div className="space-y-4">
          <p className="text-gray-400">
            Chat with our AI-powered assistant to get the latest token insights, market analysis, and community updates.
          </p>

          <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <AIChat isWidget={true} />
          </div>
        </div>
      ),
    },
    {
      id: "market",
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Market",
      content: (
        <div className="space-y-4">
          <p className="text-gray-400">
            Track real-time market activity for $DEGEN token on PumpFun and other exchanges.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PumpFunTracker />

            <Card className="border-gray-800 bg-gray-900/50">
              <CardContent className="p-6">
                <h3 className="font-orbitron font-bold mb-4">Market Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">24h Volume</span>
                    <span className="font-bold">$15,420</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Market Cap</span>
                    <span className="font-bold">$38,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Liquidity</span>
                    <span className="font-bold">$25,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Holders</span>
                    <span className="font-bold">24</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "events",
      icon: <Calendar className="h-5 w-5" />,
      title: "Events",
      content: (
        <div className="space-y-4">
          <p className="text-gray-400">Stay updated with upcoming community events, token launches, and NFT drops.</p>

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
                title: "Rat Pack Meetup",
                date: "May 20, 2025",
                desc: "IRL meetup for the most degen rats. Share strategies and celebrate our gains.",
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
      ),
    },
    {
      id: "social",
      icon: <Users className="h-5 w-5" />,
      title: "Social",
      content: (
        <div className="space-y-4">
          <p className="text-gray-400">Connect with the Degen Rug-Rats community on various social platforms.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              className="bg-[#5865F2] hover:bg-[#5865F2]/90 text-white w-full flex items-center justify-center gap-2 py-6"
              onClick={() => window.open("https://discord.gg/TnHKnJKP5w", "_blank")}
            >
              <Discord className="h-5 w-5" />
              Join Discord
            </Button>

            <Button
              className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white w-full flex items-center justify-center gap-2 py-6"
              onClick={() => window.open("https://x.com/MoandChi", "_blank")}
            >
              <Twitter className="h-5 w-5" />
              Follow Twitter
            </Button>
          </div>

          <Card className="sewer-card border-gray-800 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-800">
                <h4 className="font-orbitron font-bold">Community Stats</h4>
              </div>
              <div className="grid grid-cols-3 divide-x divide-gray-800">
                <div className="p-4 text-center">
                  <p className="text-2xl font-bold text-rat-primary">18</p>
                  <p className="text-gray-400 text-sm">Discord Members</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-2xl font-bold text-rat-secondary">42</p>
                  <p className="text-gray-400 text-sm">Twitter Followers</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-2xl font-bold text-rat-gold">24</p>
                  <p className="text-gray-400 text-sm">Token Holders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ]

  return (
    <div>
      <Tabs defaultValue="chat" onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-gray-900 border border-gray-800">
            {communityFeatures.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className={`data-[state=active]:bg-rat-primary data-[state=active]:text-white`}
              >
                <span className={cn("mr-2", activeTab === feature.id ? "text-white" : "text-gray-400")}>
                  {feature.icon}
                </span>
                {feature.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {communityFeatures.map((feature) => (
          <TabsContent key={feature.id} value={feature.id}>
            {feature.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default CommunitySection
