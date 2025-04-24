"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Coins, Check, AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"

interface TipJarProps {
  recipientAddress: string
  variant?: "default" | "outline" | "secondary"
  className?: string
}

const TipJar = ({
  recipientAddress = "Aq6YoBjyDow9SajNHRsk6u4Yx1EirxgufB4SQSyDjLww",
  variant = "default",
  className = "",
}: TipJarProps) => {
  const [amount, setAmount] = useState(0.05)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Check if wallet is connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if (typeof window === "undefined") return

        if (window.phantom?.solana) {
          const provider = window.phantom?.solana

          // Check if already connected
          try {
            const resp = await provider.connect({ onlyIfTrusted: true })
            setIsConnected(true)
            setWalletAddress(resp.publicKey.toString())
          } catch (err) {
            // Not already connected, which is fine
            setIsConnected(false)
            setWalletAddress(null)
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }

    checkWalletConnection()
  }, [])

  const handleConnectWallet = async () => {
    try {
      if (typeof window === "undefined") return

      if (!window.phantom?.solana) {
        toast({
          title: "Wallet Not Found",
          description: "Please install Phantom wallet to continue",
          variant: "destructive",
        })
        return
      }

      const provider = window.phantom?.solana
      const resp = await provider.connect()
      setIsConnected(true)
      setWalletAddress(resp.publicKey.toString())
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet",
        variant: "destructive",
      })
    }
  }

  const handleSendTip = async () => {
    if (!isConnected || !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to send a tip",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      if (typeof window === "undefined" || !window.phantom?.solana) {
        throw new Error("Phantom wallet not found")
      }

      const provider = window.phantom.solana

      // Create a Solana transaction
      const connection = provider.connection
      const fromPubkey = new window.solana.PublicKey(walletAddress)
      const toPubkey = new window.solana.PublicKey(recipientAddress)

      // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
      const lamports = Math.round(amount * 1000000000)

      // Create a transfer instruction
      const instruction = window.solana.SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })

      // Get recent blockhash
      const { blockhash } = await connection.getRecentBlockhash()

      // Create transaction and add the instruction
      const transaction = new window.solana.Transaction({
        recentBlockhash: blockhash,
        feePayer: fromPubkey,
      }).add(instruction)

      // Sign and send the transaction
      const { signature } = await provider.signAndSendTransaction(transaction)

      console.log("Transaction sent with signature:", signature)

      // Show success message
      setIsSuccess(true)
      toast({
        title: "Tip Sent!",
        description: `Thank you for your ${amount} SOL tip! The rats appreciate your generosity.`,
        duration: 5000,
      })

      // Reset amount after successful tip
      setAmount(0.05)

      // Close dialog after a short delay
      setTimeout(() => {
        setIsDialogOpen(false)
      }, 2000)
    } catch (error) {
      console.error("Error sending tip:", error)
      setError(error.message || "Failed to send tip. Please try again.")

      // Show error toast
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to send tip. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={`${variant === "default" ? "bg-rat-gold text-black hover:bg-rat-gold/90" : ""} ${className}`}
        >
          <Coins className="mr-2 h-4 w-4" />
          Tip Jar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-rat-gold" />
            Tip the Degen Rug-Rats Team
          </DialogTitle>
          <DialogDescription>
            Support the development of Degen Rug-Rats with a SOL tip. Every bit helps us build more degen features!
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="relative mx-auto w-32 h-32">
            <Image
              src="/images/sewerking.png"
              alt="SewerKing"
              fill
              className="object-contain animate-float"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="tip-amount" className="text-sm font-medium">
                Tip Amount (SOL)
              </label>
              <div className="bg-rat-gold/20 text-rat-gold px-2 py-1 rounded-md text-sm font-bold">
                {amount.toFixed(2)} SOL
              </div>
            </div>

            <Slider
              id="tip-amount"
              min={0.01}
              max={1}
              step={0.01}
              value={[amount]}
              onValueChange={(value) => setAmount(value[0])}
              className="py-4"
            />

            <div className="flex justify-between text-xs text-gray-400">
              <span>0.01 SOL</span>
              <span>0.5 SOL</span>
              <span>1 SOL</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={0.01}
              step={0.01}
              className="text-center"
            />
            <span className="font-bold">SOL</span>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>
              Recipient: {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-6)}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          {isConnected ? (
            <Button
              onClick={handleSendTip}
              className="w-full bg-rat-gold text-black hover:bg-rat-gold/90"
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Tip Sent!
                </>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  Send {amount.toFixed(2)} SOL Tip
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleConnectWallet} className="w-full bg-rat-primary hover:bg-rat-primary/90">
              Connect Wallet to Tip
            </Button>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TipJar
