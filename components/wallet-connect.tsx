"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, ExternalLink, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WalletConnectProps {
  variant?: "default" | "outline" | "secondary"
  className?: string
  showBalance?: boolean
  onWalletConnected?: (address: string) => void
}

const WalletConnect = ({
  variant = "default",
  className = "",
  showBalance = false,
  onWalletConnected,
}: WalletConnectProps) => {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showWalletOptions, setShowWalletOptions] = useState(false)
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
              const address = resp.publicKey.toString()
              setWalletConnected(true)
              setWalletAddress(address)

              // Notify parent component if callback provided
              if (onWalletConnected) {
                onWalletConnected(address)
              }

              // Get wallet balance if showBalance is true
              if (showBalance) {
                fetchWalletBalance(address)
              }
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
  }, [onWalletConnected, showBalance])

  // Fetch wallet balance
  const fetchWalletBalance = async (address: string) => {
    try {
      if (typeof window === "undefined" || !window.phantom?.solana) return

      const connection = window.phantom.solana.connection
      if (connection && connection.getBalance) {
        const balance = await connection.getBalance(address)
        if (isMounted.current) {
          setWalletBalance(balance / 1000000000) // Convert lamports to SOL
        }
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error)
    }
  }

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
        setShowWalletOptions(true)
        setIsLoading(false)
        return
      }

      const provider = window.phantom?.solana

      try {
        const resp = await provider.connect()
        if (isMounted.current) {
          const address = resp.publicKey.toString()
          setWalletConnected(true)
          setWalletAddress(address)

          // Show success toast
          toast({
            title: "Wallet Connected",
            description: `Connected to ${address.slice(0, 4)}...${address.slice(-4)}`,
            duration: 3000,
          })

          // Notify parent component if callback provided
          if (onWalletConnected) {
            onWalletConnected(address)
          }

          // Get wallet balance if showBalance is true
          if (showBalance) {
            fetchWalletBalance(address)
          }
        }
      } catch (err) {
        // Handle user rejection gracefully
        if (err.message && err.message.includes("User rejected")) {
          console.log("User rejected the connection request")
          toast({
            title: "Connection Cancelled",
            description: "You cancelled the wallet connection request",
            variant: "destructive",
            duration: 3000,
          })
        } else if (isMounted.current) {
          setError("Failed to connect wallet")
          console.error("Error connecting to wallet:", err)
          toast({
            title: "Connection Failed",
            description: "Failed to connect to your wallet. Please try again.",
            variant: "destructive",
            duration: 3000,
          })
        }
      }
    } catch (error) {
      if (isMounted.current) {
        setError("Failed to connect wallet")
        console.error("Error connecting to wallet:", error)
        toast({
          title: "Connection Error",
          description: "An error occurred while connecting to your wallet",
          variant: "destructive",
          duration: 3000,
        })
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
          setWalletBalance(null)

          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected",
            duration: 3000,
          })
        }
      }
    } catch (error) {
      if (isMounted.current) {
        setError("Failed to disconnect wallet")
        console.error("Error disconnecting wallet:", error)
        toast({
          title: "Disconnect Error",
          description: "Failed to disconnect your wallet",
          variant: "destructive",
          duration: 3000,
        })
      }
    }
  }

  if (walletConnected) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={`border-rat-primary text-rat-primary hover:bg-rat-primary/10 ${className}`}
              onClick={disconnectWallet}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Connected"}
              {showBalance && walletBalance !== null && (
                <span className="ml-2 text-xs bg-rat-primary/20 px-2 py-0.5 rounded-full">
                  {walletBalance.toFixed(2)} SOL
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to disconnect wallet</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="relative">
      <Button
        onClick={connectWallet}
        variant={variant}
        className={`${variant === "default" ? "bg-rat-primary text-white hover:bg-rat-primary/90" : ""} ${className}`}
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

      <Dialog open={showWalletOptions} onOpenChange={setShowWalletOptions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect a wallet</DialogTitle>
            <DialogDescription>You need a Solana wallet to interact with this site</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              className="flex items-center justify-between w-full"
              onClick={() => window.open("https://phantom.app/", "_blank")}
            >
              <div className="flex items-center">
                <img src="https://phantom.app/img/logo.png" alt="Phantom" className="w-6 h-6 mr-2" />
                Phantom
              </div>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              className="flex items-center justify-between w-full"
              onClick={() => window.open("https://solflare.com/", "_blank")}
            >
              <div className="flex items-center">
                <img src="https://solflare.com/assets/logo.svg" alt="Solflare" className="w-6 h-6 mr-2" />
                Solflare
              </div>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <AlertCircle className="h-4 w-4" />
            <p>Install a wallet and refresh this page to connect</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default WalletConnect
