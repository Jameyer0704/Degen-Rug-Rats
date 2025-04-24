"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, RefreshCw } from "lucide-react"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  id?: string
}

interface AIChatProps {
  isWidget?: boolean
  initialMessage?: string
  className?: string
}

// Project knowledge base for the AI
const projectKnowledge = {
  token: {
    name: "$DEGEN",
    contract: "G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump",
    totalSupply: "1,000,000,000",
    buyLinks: {
      jupiter: "https://jup.ag/swap/SOL-G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump",
      pumpfun: "https://pump.fun/coin/G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump",
    },
    price: {
      current: "$0.000042",
      change24h: "+15%",
      ath: "$0.000069",
    },
    marketCap: "$42,000",
    liquidity: "$25,000",
    volume24h: "$12,500",
    holders: "24",
    audit: "Audited by RatSec, no vulnerabilities found. Contract is non-upgradeable and ownership is renounced.",
  },
  nft: {
    name: "Degen Rug-Rats",
    total: "89",
    standard: "69",
    special: "20",
    mintPrice: "0.1 SOL",
    mintStatus: "LIVE NOW",
    marketplaces: ["Tensor", "Magic Eden", "LaunchMyNFT"],
    benefits: ["Exclusive Discord access", "Future airdrops", "Staking rewards", "Governance rights"],
  },
  community: {
    discord: "https://discord.gg/TnHKnJKP5w",
    twitter: "https://x.com/MoandChi",
    members: {
      discord: "18",
      twitter: "42",
    },
    events: [
      {
        name: "First RugPull",
        date: "April 25-26, 2025",
        description: "Community RugPull event to learn the art of the pull",
      },
      {
        name: "Sewer Raid",
        date: "May 10, 2025",
        description: "Coordinated buying event to pump the token",
      },
    ],
  },
  roadmap: {
    completed: ["Token launch", "Website launch"],
    current: ["NFT minting - 69 standard and 20 special editions"],
    upcoming: [
      "Staking platform",
      "NFT marketplace",
      "AI trading tools",
      "Strategic partnerships",
      "Metaverse integration",
      "DEX launch",
    ],
  },
}

// AI personality traits
const aiPersonality = {
  name: "SewerKing",
  traits: ["Confident", "Street-smart", "Humorous", "Knowledgeable", "Slightly mischievous"],
  speechPatterns: ["Uses rat/sewer metaphors", "Casual crypto slang", "Enthusiastic about the project"],
  catchphrases: [
    "Down in the sewers, we know what's up!",
    "That's some juicy alpha, rat!",
    "Let's get this cheese!",
    "Rats always find the best opportunities!",
    "In the crypto sewers, we thrive!",
  ],
}

const AIChat = ({
  isWidget = false,
  initialMessage = "Yo, what's up rat gang! SewerKing here, your guide to all things Degen Rug-Rats. Wanna know about our token, NFT collection, or how to join the community? Just ask and I'll hook you up with that sweet alpha!",
  className = "",
}: AIChatProps) => {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: initialMessage,
      id: "initial",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isMounted = useRef(true)

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current
      // Check if user is already at the bottom or close to it (within 100px)
      const isAtBottom = container.scrollHeight - container.clientHeight - container.scrollTop < 100

      // If at bottom or it's a new message from the AI, scroll to bottom
      if (isAtBottom || chatHistory[chatHistory.length - 1]?.role === "assistant") {
        // Use smooth scrolling for better UX
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        })
      }
    }
  }, [chatHistory])

  // Track component mount status
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const resetChat = () => {
    setChatHistory([
      {
        role: "assistant",
        content: initialMessage,
        id: "initial-reset",
      },
    ])
    setError(null)
  }

  // Helper function to get a random catchphrase
  const getRandomCatchphrase = () => {
    const randomIndex = Math.floor(Math.random() * aiPersonality.catchphrases.length)
    return aiPersonality.catchphrases[randomIndex]
  }

  // Generate a contextual response based on user input
  const generateResponse = (userInput: string) => {
    const input = userInput.toLowerCase()

    // Helper function to ensure responses aren't too long
    const formatResponse = (response: string) => {
      // Ensure response isn't too long (max ~300 chars)
      if (response.length > 300) {
        return response.substring(0, 300) + "..."
      }
      return response
    }

    // Price or token value questions
    if (input.includes("price") || input.includes("worth") || input.includes("value") || input.includes("chart")) {
      return formatResponse(
        `${getRandomCatchphrase()} The ${projectKnowledge.token.name} token is currently trading at ${projectKnowledge.token.price.current} with a ${projectKnowledge.token.price.change24h} change in the last 24 hours. Our all-time high is ${projectKnowledge.token.price.ath}! Market cap is sitting at ${projectKnowledge.token.marketCap} with ${projectKnowledge.token.liquidity} in liquidity. Volume in the last 24 hours is ${projectKnowledge.token.volume24h}. The chart's looking bullish AF right now - perfect time to load your bags!`,
      )
    }

    // How to buy questions
    if (input.includes("buy") || input.includes("get") || input.includes("purchase")) {
      return formatResponse(
        `Ready to join the rat pack? You can buy ${projectKnowledge.token.name} on Jupiter Exchange (${projectKnowledge.token.buyLinks.jupiter}) or PumpFun (${projectKnowledge.token.buyLinks.pumpfun}). Just connect your Solana wallet, swap some SOL for ${projectKnowledge.token.name}, and you're in! Contract address is ${projectKnowledge.token.contract} - always double-check it! Need help with the swap? Hit us up in the Discord and a mod will guide you through it.`,
      )
    }

    // NFT questions
    if (input.includes("nft") || input.includes("mint") || input.includes("collection")) {
      return formatResponse(
        `Our NFT collection is FIRE! We've got ${projectKnowledge.nft.total} total Degen Rug-Rats - ${projectKnowledge.nft.standard} standard editions and ${projectKnowledge.nft.special} super rare 1:1 special editions. Mint price is just ${projectKnowledge.nft.mintPrice} - absolute steal! Minting is ${projectKnowledge.nft.mintStatus}! Each NFT gets you ${projectKnowledge.nft.benefits.join(", ")}. You can find them on ${projectKnowledge.nft.marketplaces.join(", ")}. These rats are gonna MOON! 🐀💎`,
      )
    }

    // Audit or security questions
    if (input.includes("audit") || input.includes("safe") || input.includes("security") || input.includes("rug")) {
      return formatResponse(
        `Security first, rat fam! ${projectKnowledge.token.audit} We take security seriously - despite our name, we're not here to rug anyone! The liquidity is locked, and the team tokens are vested with a transparent schedule. Always DYOR, but we've made sure this project is as safe as a rat in its burrow!`,
      )
    }

    // Community questions
    if (
      input.includes("community") ||
      input.includes("discord") ||
      input.includes("telegram") ||
      input.includes("twitter") ||
      input.includes("join")
    ) {
      return formatResponse(
        `The Degen Rug-Rats community is the most savage crew in the sewers! Join our Discord at ${projectKnowledge.community.discord} or follow us on Twitter at ${projectKnowledge.community.twitter}. We've got ${projectKnowledge.community.members.discord} rats in Discord and ${projectKnowledge.community.members.twitter} following us on Twitter. We're growing fast! We've got upcoming events like ${projectKnowledge.community.events[0].name} on ${projectKnowledge.community.events[0].date} and ${projectKnowledge.community.events[1].name} on ${projectKnowledge.community.events[1].date}. Don't miss out on the alpha!`,
      )
    }

    // Roadmap questions
    if (input.includes("roadmap") || input.includes("future") || input.includes("plan") || input.includes("coming")) {
      return formatResponse(
        `Our roadmap is stacked, rat fam! We've already completed ${projectKnowledge.roadmap.completed.join(", ")}. Right now we're focused on ${projectKnowledge.roadmap.current.join(", ")}. Coming up next is ${projectKnowledge.roadmap.upcoming.slice(0, 3).join(", ")}, and long-term we're looking at ${projectKnowledge.roadmap.upcoming.slice(3).join(", ")}. The future's bright for us rats! 💰🔮`,
      )
    }

    // Team questions
    if (input.includes("team") || input.includes("founder") || input.includes("dev") || input.includes("who")) {
      return formatResponse(
        `The Degen Rug-Rats team is a group of crypto OGs who've been through multiple market cycles. They prefer to stay anon (smart in this space, ya know?), but they're super active in the Discord. The lead dev has worked on several successful Solana projects before, and our marketing rat has serious connections in the space. Come chat with them directly in our Discord - they're always dropping alpha!`,
      )
    }

    // Tokenomics questions
    if (
      input.includes("tokenomics") ||
      input.includes("supply") ||
      input.includes("distribution") ||
      input.includes("allocation")
    ) {
      return formatResponse(
        `Here's the cheese on our tokenomics: Total supply is ${projectKnowledge.token.totalSupply} ${projectKnowledge.token.name}. 40% for liquidity (locked for 6 months), 20% for marketing (vested over 12 months), 15% for development (vested over 18 months), 15% for community rewards and airdrops, and 10% for the team (vested over 24 months). No presale, no VCs, just a fair launch for all the rats in the sewer!`,
      )
    }

    // Greeting or general questions
    if (
      input.includes("hi") ||
      input.includes("hello") ||
      input.includes("hey") ||
      input.includes("sup") ||
      input.includes("yo")
    ) {
      return formatResponse(
        `Yo, what's good rat gang! ${getRandomCatchphrase()} How can I help you navigate the sewers today? Want some alpha on our token, NFTs, or community?`,
      )
    }

    // Default response for other questions
    return formatResponse(
      `Thanks for asking about "${userInput.substring(0, 30)}${userInput.length > 30 ? "..." : ""}". ${getRandomCatchphrase()} The Degen Rug-Rats project combines a Solana token with an NFT collection, creating a community of crypto enthusiasts. Our token ${projectKnowledge.token.name} is on Solana with a total supply of ${projectKnowledge.token.totalSupply}. We're currently minting our NFT collection with ${projectKnowledge.nft.standard} standard and ${projectKnowledge.nft.special} special editions. Anything specific about our token, NFTs, or community you'd like to know more about? I'm your rat, just ask!`,
    )
  }

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessageText = message.trim()
    const userMessageId = `user-${Date.now()}`

    // Add user message to chat
    setChatHistory((prev) => [...prev, { role: "user", content: userMessageText, id: userMessageId }])
    setIsLoading(true)
    setError(null)
    setMessage("") // Clear input field

    try {
      // Generate response based on user input
      const aiResponse = generateResponse(userMessageText)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (isMounted.current) {
        // Add AI response to chat
        setChatHistory((prev) => [...prev, { role: "assistant", content: aiResponse, id: `assistant-${Date.now()}` }])
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      if (isMounted.current) {
        setError("Failed to get response. Try again.")
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Yo, the sewers are flooded right now! Try again in a bit, rat fam!",
            id: `error-${Date.now()}`,
          },
        ])
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
        // Focus the input after sending
        setTimeout(() => {
          if (inputRef.current && isMounted.current) {
            inputRef.current.focus()
          }
        }, 100)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={`flex flex-col ${isWidget ? "h-full" : "h-[600px]"} ${className}`}>
      <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-rat-primary/20">
            <Image src="/images/evil-rat-king.png" alt="SewerKing" width={32} height={32} className="object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-white">SewerKing</h3>
            <p className="text-xs text-gray-400">Degen Alpha Dealer</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white"
              onClick={resetChat}
              title="Reset chat"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Badge className="bg-green-500/20 text-green-500 border-none">Online</Badge>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto p-3 space-y-3 bg-gray-900 ${isWidget ? "h-80" : ""} scrollbar-custom`}
      >
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 break-words overflow-hidden ${
                msg.role === "user" ? "bg-rat-primary/20 text-white" : "bg-gray-800 text-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 break-words overflow-hidden bg-gray-800 text-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-rat-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-rat-primary rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-rat-primary rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-800 bg-gray-900">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask SewerKing anything..."
            className="bg-gray-800 border-gray-700"
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-rat-primary hover:bg-rat-primary/90 px-3"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AIChat
