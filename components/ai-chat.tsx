"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, RefreshCw, Download, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useChat } from "@/contexts/chat-context"

interface AIChatProps {
  isWidget?: boolean
  className?: string
  tokenData?: any
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
  },
  nft: {
    name: "Degen Rug-Rats",
    total: "89",
    standard: "69",
    special: "20",
    mintPrice: "0.1 SOL",
    mintStatus: "LIVE NOW",
    marketplaces: ["Tensor", "Magic Eden", "LaunchMyNFT"],
    benefits: [
      "Exclusive Discord access",
      "Future airdrops",
      "Staking rewards",
      "Governance rights",
      "Early access to premium AI tools", // New utility
      "Lowered or no fees on premium AI tools", // New utility
      "Access to Alpha discord channels", // New utility
    ],
  },
  community: {
    discord: "https://discord.gg/TnHKnJKP5w",
    twitter: "https://x.com/MoandChi", // Using X instead of Twitter
    members: {
      discord: "18",
      x: "42", // Changed from twitter to x
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
  jokes: [
    "Why did the rat invest in crypto? Because he heard it was the CHEESE-iest way to make money!",
    "What do you call a rat that trades NFTs? A non-fungible rodent!",
    "How do rats store their crypto? In cold SQUEEEEZE wallets!",
    "Why don't rats use centralized exchanges? They prefer to keep their coins in the DeFi sewers!",
    "What's a rat's favorite blockchain? SOL-ana, because it's fast enough to escape the cats!",
    "I tried to explain NFTs to my pet rat, but he just kept trying to eat the JPEG!",
    "Why are rats good at crypto? They know when to scurry away from a rugpull!",
    "What's a rat's favorite DEX? Jupiter, because it's out of this world!",
    "How many rats does it take to mint an NFT? Just one, but you need a whole pack to pump it!",
    "My rat friend lost his crypto wallet password. Now he's SQUEAKING by on faucet drops!",
  ],
}

const AIChat = ({ isWidget = false, className = "", tokenData }: AIChatProps) => {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isMounted = useRef(true)

  // Use the shared chat context
  const { chatHistory, addMessage, resetChat } = useChat()

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

  // Helper function to get a random catchphrase
  const getRandomCatchphrase = () => {
    const randomIndex = Math.floor(Math.random() * aiPersonality.catchphrases.length)
    return aiPersonality.catchphrases[randomIndex]
  }

  // Helper function to get a random joke
  const getRandomJoke = () => {
    const randomIndex = Math.floor(Math.random() * aiPersonality.jokes.length)
    return aiPersonality.jokes[randomIndex]
  }

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { addSuffix: true })
  }

  // Export chat history
  const exportChat = () => {
    try {
      const chatText = chatHistory
        .map(
          (msg) =>
            `${msg.role === "user" ? "You" : "SewerKing"} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`,
        )
        .join("\n\n")

      const blob = new Blob([chatText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "degen-rugrats-chat.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting chat:", error)
    }
  }

  // Generate a contextual response based on user input
  const generateResponse = (userInput: string) => {
    const input = userInput.toLowerCase()

    // Get live token data if available
    const liveTokenPrice = tokenData?.price || 0.00000123
    const liveTokenPriceChange = tokenData?.priceChange24h || 5.2
    const liveMarketCap = tokenData?.marketCap || 38000
    const liveVolume = tokenData?.volume24h || 15000
    const liveLiquidity = tokenData?.liquidity || 25000
    const liveHolders = tokenData?.holders || 24

    // Check if user wants a joke
    if (input.includes("joke") || input.includes("funny") || input.includes("laugh")) {
      return `${getRandomCatchphrase()} Here's a rat joke for ya: ${getRandomJoke()} 🤣🐀`
    }

    // Price or token value questions
    if (input.includes("price") || input.includes("worth") || input.includes("value") || input.includes("chart")) {
      return `${getRandomCatchphrase()} ${projectKnowledge.token.name} is currently at $${liveTokenPrice.toFixed(8)} (${liveTokenPriceChange >= 0 ? "+" : ""}${liveTokenPriceChange.toFixed(2)}% 24h). Market cap: $${liveMarketCap.toLocaleString()}. 24h volume: $${liveVolume.toLocaleString()}. Liquidity: $${liveLiquidity.toLocaleString()}. Chart's looking bullish AF right now! 📈🐀`
    }

    // How to buy questions
    if (input.includes("buy") || input.includes("get") || input.includes("purchase")) {
      return `Ready to join the rat pack? Buy on Jupiter (${projectKnowledge.token.buyLinks.jupiter}) or PumpFun (${projectKnowledge.token.buyLinks.pumpfun}). Contract: ${projectKnowledge.token.contract}. Connect wallet, swap SOL, and you're in! 💰🐀`
    }

    // NFT questions
    if (input.includes("nft") || input.includes("mint") || input.includes("collection")) {
      return `Our NFT collection is FIRE! ${projectKnowledge.nft.total} total Rats (${projectKnowledge.nft.standard} standard, ${projectKnowledge.nft.special} 1:1 specials). Mint price: ${projectKnowledge.nft.mintPrice}. Status: ${projectKnowledge.nft.mintStatus}! Utilities include early access to our premium AI tools, lowered/no fees, and access to our Alpha discord channels! Find them on ${projectKnowledge.nft.marketplaces.join(", ")}. 🐀💎`
    }

    // NFT utility specific questions
    if (
      input.includes("utility") ||
      input.includes("utilities") ||
      input.includes("benefit") ||
      input.includes("benefits")
    ) {
      return `Our NFTs come with SICK utilities, rat! 1) Early access to our premium AI tools 2) Lowered or NO fees on our premium AI tools 3) Access to our Alpha discord channels where we share the juiciest calls 4) Exclusive Discord access 5) Future airdrops 6) Staking rewards 7) Governance rights. It's a no-brainer! 🧠🐀`
    }

    // Audit or security questions
    if (input.includes("audit") || input.includes("safe") || input.includes("security") || input.includes("rug")) {
      return `Security first, rat fam! Contract is audited, liquidity locked, team tokens vested. Despite our name, we're not here to rug anyone! We're building long-term value for our community. 🔒🐀`
    }

    // Community questions
    if (
      input.includes("community") ||
      input.includes("discord") ||
      input.includes("telegram") ||
      input.includes("twitter") ||
      input.includes("join")
    ) {
      return `Join our Discord (${projectKnowledge.community.discord}) or X (${projectKnowledge.community.twitter}). We've got ${projectKnowledge.community.members.discord} Discord rats and ${projectKnowledge.community.members.x} X followers. Don't miss our upcoming events! The sewers are getting crowded with smart rats! 🐀🧠`
    }

    // Roadmap questions
    if (input.includes("roadmap") || input.includes("future") || input.includes("plan") || input.includes("coming")) {
      return `Our roadmap is stacked! Completed: ${projectKnowledge.roadmap.completed.join(", ")}. Current: ${projectKnowledge.roadmap.current.join(", ")}. Next up: ${projectKnowledge.roadmap.upcoming.slice(0, 3).join(", ")}. The future's bright for us rats! 💰🔮`
    }

    // Team questions
    if (input.includes("team") || input.includes("founder") || input.includes("dev") || input.includes("who")) {
      return `The team is crypto OGs who've been through multiple market cycles. They're anon but super active in Discord. Our lead dev worked on several successful Solana projects before! These rats know how to build! 🛠️🐀`
    }

    // Tokenomics questions
    if (
      input.includes("tokenomics") ||
      input.includes("supply") ||
      input.includes("distribution") ||
      input.includes("allocation")
    ) {
      return `Total supply: ${projectKnowledge.token.totalSupply} ${projectKnowledge.token.name}. 40% liquidity, 20% marketing, 15% dev, 15% community, 10% team. No presale, no VCs, just a fair launch! Current holders: ${liveHolders}. We're growing every day! 📈🐀`
    }

    // AI tools questions
    if (input.includes("ai") || input.includes("tool") || input.includes("premium")) {
      return `Our premium AI tools are gonna revolutionize how degens trade! NFT holders get early access and reduced/no fees. We're talking trading signals, market analysis, sentiment tracking, and more! It's like having a whole team of quants in your pocket! 🤖🐀`
    }

    // Greeting or general questions
    if (
      input.includes("hi") ||
      input.includes("hello") ||
      input.includes("hey") ||
      input.includes("sup") ||
      input.includes("yo")
    ) {
      return `Yo, what's good rat gang! ${getRandomCatchphrase()} How can I help you navigate the sewers today? Want some alpha on our token, NFTs, or community? Or maybe a rat joke to lighten the mood? 🐀😎`
    }

    // Default response for other questions
    return `${getRandomCatchphrase()} Degen Rug-Rats is a Solana token (${projectKnowledge.token.name}) with ${projectKnowledge.nft.total} NFTs. Our NFTs give you early access to premium AI tools, reduced fees, and Alpha discord channels! What specific alpha you looking for? Token, NFTs, or community info? I'm your rat! 🐀💰`
  }

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessageText = message.trim()
    const userMessageId = `user-${Date.now()}`

    // Add user message to chat
    addMessage({ role: "user", content: userMessageText, id: userMessageId })
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
        addMessage({ role: "assistant", content: aiResponse, id: `assistant-${Date.now()}` })
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      if (isMounted.current) {
        setError("Failed to get response. Try again.")
        addMessage({
          role: "assistant",
          content: "Yo, the sewers are flooded right now! Try again in a bit, rat fam!",
          id: `error-${Date.now()}`,
        })
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

  // Quick response buttons
  const quickResponses = [
    {
      text: "Token price?",
      onClick: () => {
        setMessage("What's the current token price?")
      },
    },
    {
      text: "NFT utilities?",
      onClick: () => {
        setMessage("What utilities do the NFTs have?")
      },
    },
    {
      text: "How to buy?",
      onClick: () => {
        setMessage("How can I buy the token?")
      },
    },
    {
      text: "Tell me a joke",
      onClick: () => {
        setMessage("Tell me a crypto rat joke")
      },
    },
  ]

  return (
    <div className={`flex flex-col ${isWidget ? "h-full" : "h-[600px]"} ${className}`}>
      {/* Add global styles for scrollbars */}
      <style jsx global>{`
        /* Force scrollbar to always be visible */
        .force-scrollbar {
          overflow-y: scroll !important;
          scrollbar-width: auto !important;
          scrollbar-color: #ff5757 #333333 !important;
        }
        
        /* Extremely visible scrollbar for WebKit browsers */
        .force-scrollbar::-webkit-scrollbar {
          width: 16px !important;
          background-color: #333333 !important;
          display: block !important;
          visibility: visible !important;
        }
        
        .force-scrollbar::-webkit-scrollbar-thumb {
          background-color: #ff5757 !important;
          border-radius: 8px !important;
          border: 3px solid #333333 !important;
          min-height: 40px !important;
          visibility: visible !important;
          display: block !important;
        }
        
        .force-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #ff7777 !important;
        }
        
        .force-scrollbar::-webkit-scrollbar-track {
          background-color: #333333 !important;
          border-radius: 8px !important;
          visibility: visible !important;
          display: block !important;
        }
      `}</style>

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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={exportChat}
            title="Export chat"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={resetChat}
            title="Reset chat"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Badge className="bg-green-500/20 text-green-500 border-none">Online</Badge>
        </div>
      </div>

      {/* Chat container with forced scrollbar */}
      <div
        ref={chatContainerRef}
        className="force-scrollbar flex-1 p-3 space-y-3 bg-gray-900"
        style={{
          minHeight: isWidget ? "200px" : "300px",
          maxHeight: isWidget ? "70vh" : "500px",
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "scrollbar",
        }}
      >
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 break-words ${
                msg.role === "user" ? "bg-rat-primary/20 text-white" : "bg-gray-800 text-gray-200"
              }`}
            >
              {msg.content}
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatTimestamp(msg.timestamp)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 break-words bg-gray-800 text-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-rat-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-rat-primary rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-rat-primary rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        {/* Add extra space at the bottom to ensure scrollability */}
        <div style={{ height: "20px" }}></div>
      </div>

      {/* Quick response buttons */}
      <div className="p-2 border-t border-gray-800 bg-gray-900 flex flex-wrap gap-2">
        {quickResponses.map((response, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs border-gray-700 hover:bg-rat-primary/20 hover:text-white"
            onClick={response.onClick}
          >
            {response.text}
          </Button>
        ))}
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
