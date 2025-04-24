"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  id: string
  timestamp: number
}

interface ChatContextType {
  chatHistory: ChatMessage[]
  addMessage: (message: Omit<ChatMessage, "timestamp">) => void
  resetChat: () => void
}

const initialMessage: ChatMessage = {
  role: "assistant",
  content:
    "Yo, what's up rat gang! SewerKing here, your guide to all things Degen Rug-Rats. Wanna know about our token, NFT collection, or how to join the community? Just ask and I'll hook you up with that sweet alpha!",
  id: "initial",
  timestamp: Date.now(),
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([initialMessage])

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const savedChat = localStorage.getItem("degenRugRatsChat")
      if (savedChat) {
        setChatHistory(JSON.parse(savedChat))
      }
    } catch (error) {
      console.error("Error loading chat history:", error)
    }
  }, [])

  // Save chat history to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("degenRugRatsChat", JSON.stringify(chatHistory))
    } catch (error) {
      console.error("Error saving chat history:", error)
    }
  }, [chatHistory])

  const addMessage = (message: Omit<ChatMessage, "timestamp">) => {
    const newMessage = { ...message, timestamp: Date.now() }
    setChatHistory((prev) => [...prev, newMessage])
  }

  const resetChat = () => {
    setChatHistory([initialMessage])
  }

  return <ChatContext.Provider value={{ chatHistory, addMessage, resetChat }}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
