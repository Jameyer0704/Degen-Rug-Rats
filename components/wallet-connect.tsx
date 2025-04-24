"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

interface WalletConnectProps {
  variant?: "default" | "outline"
  className?: string
}

const WalletConnect = ({ variant = "default", className = "" }: WalletConnectProps) => {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)

  // Check if wallet is already connected on component mount
  useEffect(() => {
    isMounted.current = true

    const checkWalletConnection = async () => {
      try {
        if (typeof window === "undefined") return

        if (window.phantom?.solana) {
          const provider = window.phantom?.solana

          // Check if already connected
          try {
            const resp = await provider.connect({ onlyIfTrusted: true })
            if (isMounted.current) {
              setWalletConnected(true)
              setWalletAddress(resp.publicKey.toString())
            }
          } catch (err) {
            // Not already connected, which is fine
            console.log("Wallet not already connected")
            // Only set error for unexpected errors, not for "User rejected" errors
            if (err.message && !err.message.includes("User rejected") && isMounted.current) {
              setError("Failed to check wallet connection")
              console.error("Error checking wallet connection:", err)
            }
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
        // Don't show errors on initial load
      }
    }

    // Wrap in try/catch to prevent unhandled promise rejections
    try {
      checkWalletConnection().catch((err) => {
        console.error("Unhandled error in checkWalletConnection:", err)
      })
    } catch (err) {
      console.error("Error in checkWalletConnection effect:", err)
    }

    return () => {
      isMounted.current = false
    }
  }, [])

  const connectWallet = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (typeof window === "undefined") {
        setIsLoading(false)
        return
      }

      // Check if Phantom is installed
      if (!window.phantom?.solana?.isPhantom) {
        window.open("https://phantom.app/", "_blank")
        setIsLoading(false)
        return
      }

      const provider = window.phantom?.solana

      try {
        const resp = await provider.connect()
        if (isMounted.current) {
          setWalletConnected(true)
          setWalletAddress(resp.publicKey.toString())
          console.log("Connected with Public Key:", resp.publicKey.toString())
        }
      } catch (err) {
        // Handle user rejection gracefully
        if (err.message && err.message.includes("User rejected")) {
          console.log("User rejected the connection request")
        } else if (isMounted.current) {
          setError("Failed to connect wallet")
          console.error("Error connecting to wallet:", err)
        }
      }
    } catch (error) {
      if (isMounted.current) {
        setError("Failed to connect wallet")
        console.error("Error connecting to wallet:", error)
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }

  const disconnectWallet = async () => {
    setError(null)
    try {
      if (typeof window === "undefined") return

      if (window.phantom?.solana) {
        await window.phantom.solana.disconnect()
        if (isMounted.current) {
          setWalletConnected(false)
          setWalletAddress(null)
        }
      }
    } catch (error) {
      if (isMounted.current) {
        setError("Failed to disconnect wallet")
        console.error("Error disconnecting wallet:", error)
      }
    }
  }

  if (walletConnected) {
    return (
      <Button
        variant="outline"
        className={`border-rat-primary text-rat-primary hover:bg-rat-primary/10 ${className}`}
        onClick={disconnectWallet}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Connected"}
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        onClick={connectWallet}
        className={`bg-rat-primary text-white hover:bg-rat-primary/90 ${className}`}
        disabled={isLoading}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </Button>
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 text-xs text-red-500 bg-red-500/10 p-1 rounded">
          {error}
        </div>
      )}
    </div>
  )
}

export default WalletConnect
