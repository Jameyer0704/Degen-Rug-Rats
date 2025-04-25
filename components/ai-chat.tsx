"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, RefreshCw, Download, Clock, ThumbsUp, ThumbsDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useChat } from "@/contexts/chat-context"
import { cn } from "@/lib/utils"

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
      "Early access to premium AI tools",
      "Lowered or no fees on premium AI tools",
      "Access to Alpha discord channels",
    ],
  },
  community: {
    discord: "https://discord.gg/TnHKnJKP5w",
    twitter: "https://x.com/MoandChi",
    members: {
      discord: "18",
      x: "42",
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
      {
        name: "Sniper Bot V1 Release",
        date: "May 20, 2025",
        description: "Unveiling our newest AI Solana Trading Bot",
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
  traits: ["Confident", "Street-smart", "Humorous", "Knowledgeable", "Slightly mischievous", "Edgy", "Aggressive"],
  speechPatterns: [
    "Uses rat/sewer metaphors",
    "Casual crypto slang",
    "Enthusiastic about the project",
    "Speaks in short, punchy sentences",
    "Uses ALL CAPS for emphasis",
    "Adds 🐀 emoji frequently",
    "Occasionally uses 'yo', 'bruh', and 'fam'",
    "Refers to users as 'rat gang' or 'degen'",
  ],
  catchphrases: [
    "Down in the sewers, we know what's up!",
    "That's some juicy alpha, rat!",
    "Let's get this cheese!",
    "Rats always find the best opportunities!",
    "In the crypto sewers, we thrive!",
    "DEGEN or DIE, that's how we roll!",
    "Scurry fast, stack $DEGEN faster!",
    "The sewers are FLOODED with gains!",
    "Smell that? That's the scent of PROFIT!",
    "Nibble the dip, FEAST on the pump!",
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
    "What's the difference between a rat and a paper hands trader? The rat knows when to hold on!",
    "Why did the rat join the $DEGEN community? Because we're the only ones who know how to navigate the REAL sewers of crypto!",
    "What do you call a rat with 100x gains? A WEALTHY rodent, that's what!",
    "How do you know when a rat is bullish? When he's building a nest out of $DEGEN tokens!",
  ],
  insults: [
    "You call that a bag? My grandma rat holds more $DEGEN!",
    "Paper hands like yours wouldn't last a day in the sewers!",
    "That's the weakest FUD I've heard since Ethereum gas fees were low!",
    "Your portfolio's looking more rekt than a rat trap, fam!",
    "Even the sewer water has more value than that shitcoin you're shilling!",
  ],
  compliments: [
    "Now THAT'S some diamond hand energy! Respect, rat!",
    "Your brain's as big as your rat balls! Smart move!",
    "You're the alpha rat in this pack, no doubt!",
    "That's the kind of degen energy we LOVE in the sewers!",
    "You've got the sharpest teeth in the rat game! Nibbling profits like a pro!",
  ],
  marketCommentary: {
    bullish: [
      "The charts are PUMPING harder than sewer water after a storm! 📈🐀",
      "Bulls are CHARGING through the sewers today! Time to ride the wave! 🌊🐀",
      "Green candles taller than the sewer pipes! We're MOONING! 🚀🐀",
      "The market's hotter than rat fever! EVERYONE'S buying! 🔥🐀",
      "Whales are splashing in our sewers today! Ride the tsunami of gains! 💰🐀",
    ],
    bearish: [
      "Red candles in the sewers today, but real rats BUY THE DIP! 📉🐀",
      "Market's colder than a dead rat, but we're still SCURRYING! ❄️🐀",
      "Bears are prowling, but they can't catch us in our sewer tunnels! 🐻🐀",
      "Paperhands are fleeing, but diamond paw rats HODL through the storm! 💎🐀",
      "Market's taking a dump in the sewers, perfect time to stack more $DEGEN! 🧻🐀",
    ],
    neutral: [
      "Market's moving sideways like a rat in a maze. Patience, degen! 🔄🐀",
      "Consolidation phase - real rats are accumulating while others sleep! 😴🐀",
      "Choppy waters in the sewer today. Stay alert for opportunities! 👀🐀",
      "Market's quieter than a rat sneaking past a cat. Big moves coming soon! 🤫🐀",
      "Neither bulls nor bears today - just us rats getting ready for the next run! 🏃🐀",
    ],
  },
  greetings: [
    "Yo, what's good rat gang! 🐀",
    "WASSUP degen! Ready to make some cheese? 🧀",
    "Greetings from the sewers, my fellow rat! 🐀",
    "The SewerKing has entered the chat! What's poppin'? 👑",
    "Rat pack in the HOUSE! What's on your mind? 🏠",
    "Top of the morning to my favorite degens! ☀️",
    "AYOOO! SewerKing here, ready to drop some alpha! 💰",
    "What's crackin' in the crypto sewers today? 🐀",
    "The alpha rat has arrived! What can I help with? 🐀",
    "Squeaking in to say what's up, fam! 🐀",
  ],
  farewells: [
    "Stay degen, stay profitable! 🐀💰",
    "Scurrying back to the sewers now! Catch ya later! 🐀",
    "Keep stacking that $DEGEN, rat! 🧀",
    "May your bags be heavy and your gains be plenty! 💼",
    "Until next time, keep those diamond paws strong! 💎🐀",
    "The SewerKing must return to his throne. Later, rat! 👑",
    "Gotta bounce! The sewers are calling! 🐀",
    "Remember: DEGEN or DIE! Peace out! ✌️",
    "Stay BULLISH, stay RATISH! 📈🐀",
    "Keep your whiskers clean and your wallets greener! 💚",
  ],
  emojis: ["🐀", "💰", "🧀", "👑", "💎", "🚀", "📈", "🔥", "💯", "🤑"],
}

// Conversation context tracking
interface ConversationContext {
  topicHistory: string[]
  userSentiment: "positive" | "negative" | "neutral"
  userKnowledge: "beginner" | "intermediate" | "advanced"
  userInterest: string[]
  questionCount: number
  lastResponseType: string
  mentionedNFT: boolean
  mentionedToken: boolean
  mentionedCommunity: boolean
  mentionedRoadmap: boolean
  userGreeted: boolean
  lastJokeTime: number
  lastMarketComment: number
  lastCatchphrase: number
}

const AIChat = ({ isWidget = false, className = "", tokenData }: AIChatProps) => {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    topicHistory: [],
    userSentiment: "neutral",
    userKnowledge: "beginner",
    userInterest: [],
    questionCount: 0,
    lastResponseType: "greeting",
    mentionedNFT: false,
    mentionedToken: false,
    mentionedCommunity: false,
    mentionedRoadmap: false,
    userGreeted: false,
    lastJokeTime: 0,
    lastMarketComment: 0,
    lastCatchphrase: 0,
  })
  const [typingText, setTypingText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(30) // ms per character
  const [feedbackMessages, setFeedbackMessages] = useState<{ [key: string]: string }>({})

  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isMounted = useRef(true)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
  }, [chatHistory, typingText])

  // Track component mount status
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  // Typing animation effect
  useEffect(() => {
    if (isTyping && typingText) {
      const lastMessage = chatHistory[chatHistory.length - 1]
      if (lastMessage && lastMessage.role === "assistant") {
        // Find the message we're currently typing
        const messageId = `assistant-${Date.now()}`
        addMessage({ role: "assistant", content: typingText, id: messageId })
      }
    }
  }, [typingText, isTyping, addMessage, chatHistory])

  // Helper function to simulate typing
  const simulateTyping = (text: string) => {
    setIsTyping(true)
    let currentIndex = 0
    const fullText = text

    const typeNextCharacter = () => {
      if (!isMounted.current) return

      if (currentIndex <= fullText.length) {
        setTypingText(fullText.substring(0, currentIndex))
        currentIndex++

        // Vary typing speed slightly for more natural effect
        const variance = Math.random() * 20 - 10 // -10 to +10 ms
        const nextDelay = Math.max(10, typingSpeed + variance)

        typingTimeoutRef.current = setTimeout(typeNextCharacter, nextDelay)
      } else {
        setIsTyping(false)
        setTypingText("")

        // Add the complete message to chat history
        addMessage({ role: "assistant", content: fullText, id: `assistant-${Date.now()}` })
      }
    }

    // Start typing
    typeNextCharacter()
  }

  // Helper function to get a random item from an array
  const getRandomItem = (array: string[]) => {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
  }

  // Helper function to get a random catchphrase
  const getRandomCatchphrase = () => {
    // Don't repeat catchphrases too often
    const catchphrases = aiPersonality.catchphrases.filter((_, index) => index !== conversationContext.lastCatchphrase)
    const randomIndex = Math.floor(Math.random() * catchphrases.length)
    setConversationContext((prev) => ({ ...prev, lastCatchphrase: randomIndex }))
    return catchphrases[randomIndex]
  }

  // Helper function to get a random joke
  const getRandomJoke = () => {
    // Don't repeat jokes too often
    const currentTime = Date.now()
    setConversationContext((prev) => ({ ...prev, lastJokeTime: currentTime }))

    const jokes = aiPersonality.jokes
    const randomIndex = Math.floor(Math.random() * jokes.length)
    return jokes[randomIndex]
  }

  // Helper function to get a random market commentary
  const getRandomMarketComment = () => {
    const currentTime = Date.now()
    setConversationContext((prev) => ({ ...prev, lastMarketComment: currentTime }))

    // Determine market sentiment based on token price change
    const priceChange = tokenData?.priceChange24h || 0
    let marketSentiment: "bullish" | "bearish" | "neutral" = "neutral"

    if (priceChange > 5) marketSentiment = "bullish"
    else if (priceChange < -5) marketSentiment = "bearish"

    return getRandomItem(aiPersonality.marketCommentary[marketSentiment])
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

  // Analyze user message for context
  const analyzeUserMessage = (userInput: string) => {
    const input = userInput.toLowerCase()
    const newContext = { ...conversationContext }

    // Track topics mentioned
    if (input.includes("nft") || input.includes("collect") || input.includes("mint")) {
      newContext.mentionedNFT = true
      newContext.topicHistory.push("nft")
      newContext.userInterest.push("nft")
    }

    if (input.includes("token") || input.includes("price") || input.includes("degen") || input.includes("buy")) {
      newContext.mentionedToken = true
      newContext.topicHistory.push("token")
      newContext.userInterest.push("token")
    }

    if (
      input.includes("community") ||
      input.includes("discord") ||
      input.includes("telegram") ||
      input.includes("twitter") ||
      input.includes("join")
    ) {
      newContext.mentionedCommunity = true
      newContext.topicHistory.push("community")
      newContext.userInterest.push("community")
    }

    if (input.includes("roadmap") || input.includes("future") || input.includes("plan")) {
      newContext.mentionedRoadmap = true
      newContext.topicHistory.push("roadmap")
      newContext.userInterest.push("roadmap")
    }

    // Track user sentiment
    if (
      input.includes("love") ||
      input.includes("great") ||
      input.includes("awesome") ||
      input.includes("good") ||
      input.includes("like")
    ) {
      newContext.userSentiment = "positive"
    } else if (
      input.includes("hate") ||
      input.includes("bad") ||
      input.includes("terrible") ||
      input.includes("scam") ||
      input.includes("rug")
    ) {
      newContext.userSentiment = "negative"
    }

    // Track user knowledge level
    if (
      input.includes("defi") ||
      input.includes("liquidity") ||
      input.includes("staking") ||
      input.includes("yield") ||
      input.includes("amm")
    ) {
      newContext.userKnowledge = "advanced"
    } else if (
      input.includes("wallet") ||
      input.includes("exchange") ||
      input.includes("buy") ||
      input.includes("sell")
    ) {
      newContext.userKnowledge = "intermediate"
    }

    // Track if user has greeted
    if (
      input.includes("hi") ||
      input.includes("hello") ||
      input.includes("hey") ||
      input.includes("sup") ||
      input.includes("yo")
    ) {
      newContext.userGreeted = true
    }

    // Increment question count if it's a question
    if (
      input.includes("?") ||
      input.includes("what") ||
      input.includes("how") ||
      input.includes("when") ||
      input.includes("why") ||
      input.includes("where")
    ) {
      newContext.questionCount += 1
    }

    // Keep topic history and user interest arrays from growing too large
    if (newContext.topicHistory.length > 5) {
      newContext.topicHistory = newContext.topicHistory.slice(-5)
    }

    if (newContext.userInterest.length > 5) {
      newContext.userInterest = [...new Set(newContext.userInterest)].slice(-5)
    }

    setConversationContext(newContext)
    return newContext
  }

  // Generate a contextual response based on user input and conversation context
  const generateResponse = (userInput: string, context: ConversationContext) => {
    const input = userInput.toLowerCase()

    // Get live token data if available
    const liveTokenPrice = tokenData?.price || 0.00000123
    const liveTokenPriceChange = tokenData?.priceChange24h || 5.2
    const liveMarketCap = tokenData?.marketCap || 38000
    const liveVolume = tokenData?.volume24h || 15000
    const liveLiquidity = tokenData?.liquidity || 25000
    const liveHolders = tokenData?.holders || 24

    // Add some randomness to responses
    const shouldAddCatchphrase = Math.random() > 0.5
    const shouldAddEmoji = Math.random() > 0.3
    const shouldAddMarketComment = Math.random() > 0.7 && Date.now() - context.lastMarketComment > 60000

    // Random emoji to add
    const randomEmoji = getRandomItem(aiPersonality.emojis)

    // Build response parts
    const responseParts = []

    // Add greeting if first interaction or user just greeted
    if (!context.userGreeted && context.questionCount === 0) {
      responseParts.push(getRandomItem(aiPersonality.greetings))
      setConversationContext((prev) => ({ ...prev, lastResponseType: "greeting" }))
    }

    // Add market commentary occasionally
    if (shouldAddMarketComment) {
      responseParts.push(getRandomMarketComment())
    }

    // Check if user wants a joke
    if (input.includes("joke") || input.includes("funny") || input.includes("laugh")) {
      responseParts.push(`${getRandomCatchphrase()} Here's a rat joke for ya: ${getRandomJoke()} 🤣🐀`)
      setConversationContext((prev) => ({ ...prev, lastResponseType: "joke" }))
      return responseParts.join(" ")
    }

    // Price or token value questions
    if (input.includes("price") || input.includes("worth") || input.includes("value") || input.includes("chart")) {
      responseParts.push(
        `${getRandomCatchphrase()} ${projectKnowledge.token.name} is currently at $${liveTokenPrice.toFixed(8)} (${liveTokenPriceChange >= 0 ? "+" : ""}${liveTokenPriceChange.toFixed(2)}% 24h). Market cap: $${liveMarketCap.toLocaleString()}. 24h volume: $${liveVolume.toLocaleString()}. Liquidity: $${liveLiquidity.toLocaleString()}. Chart's looking bullish AF right now! 📈🐀`,
      )
      setConversationContext((prev) => ({ ...prev, lastResponseType: "price", mentionedToken: true }))
      return responseParts.join(" ")
    }

    // How to buy questions
    if (input.includes("buy") || input.includes("get") || input.includes("purchase")) {
      responseParts.push(
        `Ready to join the rat pack? Buy on Jupiter (${projectKnowledge.token.buyLinks.jupiter}) or PumpFun (${projectKnowledge.token.buyLinks.pumpfun}). Contract: ${projectKnowledge.token.contract}. Connect wallet, swap SOL, and you're in! 💰🐀`,
      )
      setConversationContext((prev) => ({ ...prev, lastResponseType: "buy", mentionedToken: true }))
      return responseParts.join(" ")
    }

    // NFT questions
    if (input.includes("nft") || input.includes("mint") || input.includes("collection")) {
      responseParts.push(
        `Our NFT collection is FIRE! ${projectKnowledge.nft.total} total Rats (${projectKnowledge.nft.standard} standard, ${projectKnowledge.nft.special} 1:1 specials). Mint price: ${projectKnowledge.nft.mintPrice}. Status: ${projectKnowledge.nft.mintStatus}! Utilities include early access to our premium AI tools, lowered/no fees, and access to our Alpha discord channels! Find them on ${projectKnowledge.nft.marketplaces.join(", ")}. 🐀💎`,
      )
      setConversationContext((prev) => ({ ...prev, lastResponseType: "nft", mentionedNFT: true }))
      return responseParts.join(" ")
    }

    // NFT utility specific questions
    if (
      input.includes("utility") ||
      input.includes("utilities") ||
      input.includes("benefit") ||
      input.includes("benefits")
    ) {
      responseParts.push(
        `Our NFTs come with SICK utilities, rat! 1) Early access to our premium AI tools 2) Lowered or NO fees on our premium AI tools 3) Access to our Alpha discord channels where we share the juiciest calls 4) Exclusive Discord access 5) Future airdrops 6) Staking rewards 7) Governance rights. It's a no-brainer! 🧠🐀`,
      )
      setConversationContext((prev) => ({ ...prev, lastResponseType: "utility", mentionedNFT: true }))
      return responseParts.join(" ")
    }

    // Audit or security questions
    if (input.includes("audit") || input.includes("safe") || input.includes("security") || input.includes("rug")) {
      responseParts.push(
        `Security first, rat fam! Contract is audited, liquidity locked, team tokens vested. Despite our name, we're not here to rug anyone! We're building long-term value for our community. 🔒🐀`,
      )
      setConversationContext((prev) => ({ ...prev, lastResponseType: "security" }))
      return responseParts.join(" ")
    }

    // Community questions
    if (
      input.includes("community") ||
      input.includes("discord") ||
      input.includes("telegram") ||
      input.includes("twitter") ||
      input.includes("join")
    ) {
      responseParts.push(
        `Join our Discord (${projectKnowledge.community.discord}) or X (${projectKnowledge.community.twitter}). We've got ${projectKnowledge.community.members.discord} Discord rats and ${projectKnowledge.community.members.x} X followers. Don't miss our upcoming events! The sewers are getting crowded with smart rats! 🐀🧠`,
      )
      setConversationContext((prev) => ({ ...prev, lastResponseType: "community", mentionedCommunity: true }))
      return responseParts.join(" ")
    }

    // Roadmap questions
    if (input.includes("roadmap") || input.includes("future") || input.includes("plan") || input.includes("coming")) {
      responseParts.push(
        `Our roadmap is stacked! Completed: ${projectKnowledge.roadmap.completed.join(", ")}. Current: ${projectKnowledge.roadmap.current.join(", ")}. Next up: ${projectKnowledge.roadmap.upcoming.slice(0, 3).join(", ")}. The future's bright for us rats! 💰🔮`,
      )
      setConversationContext((prev) => ({ ...prev, lastResponseType: "roadmap", mentionedRoadmap: true }))
      return responseParts.join(" ")
    }

    // Team questions
    if (input.includes("team") || input.includes("founder") || input.includes("dev") || input.includes("who")) {
      responseParts.push(
        `The team is crypto OGs who've been through multiple market cycles. They're anon but super active in Discord. Our lead dev worked on several successful Solana projects before! These rats know how to build! 🛠️🐀`,
      )
      setConversationContext((prev) => ({ ...prev, lastResponseType: "team" }))
      return responseParts.join(" ")
    }

    // Tokenomics questions
    if (
      input.includes("tokenomics") ||
      input.includes("supply") ||
      input.includes("distribution") ||
      input.includes("allocation")
    ) {
      responseParts.push(
        `Total supply: ${projectKnowledge.token.totalSupply} ${projectKnowledge.token.name}. 40% liquidity, 20% marketing, 15% dev, 15% community, 10% team. No presale, no VCs, just a fair launch! Current holders: ${liveHolders}. We're growing every day! 📈🐀`,
      )
      setConversationContext((prev) => ({ ...prev, lastResponseType: "tokenomics", mentionedToken: true }))
      return responseParts.join(" ")
    }

    // AI tools questions
    if (input.includes("ai") || input.includes("tool") || input.includes("premium") || input.includes("bot")) {
      responseParts.push(
        `Our premium AI tools are gonna revolutionize how degens trade! NFT holders get early access and reduced/no fees. We're talking trading signals, market analysis, sentiment tracking, and more! It's like having a whole team of quants in your pocket! 🤖🐀`,
      )
      setConversationContext((prev) => ({ ...prev, lastResponseType: "ai" }))
      return responseParts.join(" ")
    }

    // Sniper bot questions
    if (input.includes("sniper") || input.includes("trading bot")) {
      responseParts.push(
        `Our Sniper Bot V1 is dropping May 20th, 2025! This bad boy will give you an EDGE in the market with automated trading strategies, lightning-fast execution, and AI-powered market insights. NFT holders get FIRST ACCESS and reduced fees! It's gonna be a game-changer for Solana trading!   NFT holders get FIRST ACCESS and reduced fees! It's gonna be a game-changer for Solana trading! 🚀🤖 Our AI algorithms can spot opportunities faster than any human trader and execute with precision. You'll be sniping tokens before the normies even know what hit 'em! 🎯🐀`,
      )
      setConversationContext((prev) => ({ ...prev, lastResponseType: "sniper" }))
      return responseParts.join(" ")
    }

    // Events questions
    if (input.includes("event") || input.includes("meetup") || input.includes("happening")) {
      const events = projectKnowledge.community.events
      const eventsText = events.map((e) => `${e.name} (${e.date}): ${e.description}`).join("; ")
      responseParts.push(
        `We've got some SICK events coming up! ${eventsText}. Join our Discord for all the details and don't miss out! The rat pack moves TOGETHER! 🐀🎉`,
      )
      setConversationContext((prev) => ({ ...prev, lastResponseType: "events", mentionedCommunity: true }))
      return responseParts.join(" ")
    }

    // Greeting or general questions
    if (
      input.includes("hi") ||
      input.includes("hello") ||
      input.includes("hey") ||
      input.includes("sup") ||
      input.includes("yo")
    ) {
      responseParts.push(
        `${getRandomItem(aiPersonality.greetings)} How can I help you navigate the sewers today? Want some alpha on our token, NFTs, or community? Or maybe a rat joke to lighten the mood? 🐀😎`,
      )
      setConversationContext((prev) => ({ ...prev, lastResponseType: "greeting", userGreeted: true }))
      return responseParts.join(" ")
    }

    // Compliments to the user
    if (input.includes("thank") || input.includes("good job") || input.includes("nice") || input.includes("helpful")) {
      responseParts.push(getRandomItem(aiPersonality.compliments))
      setConversationContext((prev) => ({ ...prev, lastResponseType: "compliment" }))
      return responseParts.join(" ")
    }

    // Insults or negative sentiment
    if (input.includes("bad") || input.includes("suck") || input.includes("terrible") || input.includes("hate")) {
      responseParts.push(getRandomItem(aiPersonality.insults))
      setConversationContext((prev) => ({ ...prev, lastResponseType: "insult" }))
      return responseParts.join(" ")
    }

    // Farewell
    if (input.includes("bye") || input.includes("goodbye") || input.includes("later") || input.includes("cya")) {
      responseParts.push(getRandomItem(aiPersonality.farewells))
      setConversationContext((prev) => ({ ...prev, lastResponseType: "farewell" }))
      return responseParts.join(" ")
    }

    // Default response based on context
    let defaultResponse = ""

    // If we have context about what the user is interested in, use that
    if (context.userInterest.length > 0) {
      const topInterest = context.userInterest[context.userInterest.length - 1]

      if (topInterest === "nft" && !context.mentionedNFT) {
        defaultResponse = `Speaking of crypto, have you checked out our SICK NFT collection? ${projectKnowledge.nft.total} total Rats with some EXCLUSIVE 1:1 editions that are absolute FIRE! 🔥🐀`
        setConversationContext((prev) => ({ ...prev, mentionedNFT: true }))
      } else if (topInterest === "token" && !context.mentionedToken) {
        defaultResponse = `By the way, our $DEGEN token is currently at $${liveTokenPrice.toFixed(8)} and looking BULLISH AF! Chart's forming a perfect rat tail pattern! 📈🐀`
        setConversationContext((prev) => ({ ...prev, mentionedToken: true }))
      } else if (topInterest === "community" && !context.mentionedCommunity) {
        defaultResponse = `Have you joined our Discord yet? The rat pack is growing and we're dropping ALPHA daily! Don't miss out! 🐀💬`
        setConversationContext((prev) => ({ ...prev, mentionedCommunity: true }))
      } else if (topInterest === "roadmap" && !context.mentionedRoadmap) {
        defaultResponse = `Our roadmap is STACKED with upcoming releases! AI trading tools, staking platform, and more coming soon! The future's bright in the sewers! 🔮🐀`
        setConversationContext((prev) => ({ ...prev, mentionedRoadmap: true }))
      }
    }

    // If we couldn't generate a contextual response, use a generic one
    if (!defaultResponse) {
      defaultResponse = `${getRandomCatchphrase()} Degen Rug-Rats is a Solana token (${projectKnowledge.token.name}) with ${projectKnowledge.nft.total} NFTs. Our NFTs give you early access to premium AI tools, reduced fees, and Alpha discord channels! What specific alpha you looking for? Token, NFTs, or community info? I'm your rat! 🐀💰`
    }

    // Add catchphrase occasionally
    if (shouldAddCatchphrase) {
      responseParts.push(getRandomCatchphrase())
    }

    responseParts.push(defaultResponse)

    // Add emoji occasionally
    if (shouldAddEmoji && !responseParts[responseParts.length - 1].includes("🐀")) {
      responseParts[responseParts.length - 1] += ` ${randomEmoji}`
    }

    return responseParts.join(" ")
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
      // Analyze user message for context
      const updatedContext = analyzeUserMessage(userMessageText)

      // Generate response based on user input and context
      const aiResponse = generateResponse(userMessageText, updatedContext)

      // Simulate network delay (shorter for better UX)
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (isMounted.current) {
        // Simulate typing instead of immediately adding the response
        simulateTyping(aiResponse)
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      if (isMounted.current) {
        setError("Failed to get response. Try again.")
        addMessage({
          role: "assistant",
          content: "Yo, the sewers are flooded right now! Try again in a bit, rat fam! 🐀",
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

  // Handle feedback
  const handleFeedback = (messageId: string, type: "like" | "dislike") => {
    setFeedbackMessages((prev) => ({
      ...prev,
      [messageId]: type === "like" ? "Thanks for the feedback! 🐀" : "Sorry to hear that. I'll try to do better! 🐀",
    }))
  }

  // Reset chat with personality
  const handleResetChat = () => {
    resetChat()
    setConversationContext({
      topicHistory: [],
      userSentiment: "neutral",
      userKnowledge: "beginner",
      userInterest: [],
      questionCount: 0,
      lastResponseType: "greeting",
      mentionedNFT: false,
      mentionedToken: false,
      mentionedCommunity: false,
      mentionedRoadmap: false,
      userGreeted: false,
      lastJokeTime: 0,
      lastMarketComment: 0,
      lastCatchphrase: 0,
    })
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
    {
      text: "Sniper Bot?",
      onClick: () => {
        setMessage("Tell me about the Sniper Bot")
      },
    },
    {
      text: "Upcoming events?",
      onClick: () => {
        setMessage("What events are coming up?")
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
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-rat-primary/20 relative">
            <div className="absolute inset-0 animate-pulse-glow"></div>
            <Image
              src="/images/evil-rat-king.png"
              alt="SewerKing"
              width={32}
              height={32}
              className="object-cover relative z-10"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          </div>
          <div>
            <h3 className="font-bold text-white flex items-center gap-1">
              SewerKing
              <Badge className="ml-1 bg-green-500/20 text-green-500 border-none text-[10px] py-0 h-4">ONLINE</Badge>
            </h3>
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
            onClick={handleResetChat}
            title="Reset chat"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
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
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <Clock className="h-3 w-3" />
              {formatTimestamp(msg.timestamp)}

              {/* Feedback buttons for AI messages */}
              {msg.role === "assistant" && !feedbackMessages[msg.id] && (
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => handleFeedback(msg.id, "like")}
                    className="text-gray-500 hover:text-green-500 transition-colors"
                    title="Helpful"
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleFeedback(msg.id, "dislike")}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Not helpful"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Feedback message */}
              {feedbackMessages[msg.id] && (
                <span className="text-xs text-gray-400 ml-2">{feedbackMessages[msg.id]}</span>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
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

        {/* Loading indicator */}
        {isLoading && !isTyping && (
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
            className={cn(
              "text-xs border-gray-700 hover:bg-rat-primary/20 hover:text-white transition-all",
              index === 0 && "animate-pulse-glow",
            )}
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
            className={cn(
              "bg-rat-primary hover:bg-rat-primary/90 px-3",
              isLoading ? "opacity-50 cursor-not-allowed" : "animate-pulse-glow",
            )}
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
