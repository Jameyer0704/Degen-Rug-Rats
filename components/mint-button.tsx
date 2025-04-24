"use client"

import { useEffect } from "react"
import Script from "next/script"

interface MintButtonProps {
  ownerId?: string
  collectionId?: string
  showCounter?: boolean
  className?: string
}

export default function MintButton({
  ownerId = "Aq6YoBjyDow9SajNHRsk6u4Yx1EirxgufB4SQSyDjLww",
  collectionId = "dM7WPNgIA0hj5aCvevc2",
  showCounter = true,
  className = "",
}: MintButtonProps) {
  useEffect(() => {
    // Define global variables for the LaunchMyNFT script
    window.ownerId = ownerId
    window.collectionId = collectionId

    // Add error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Check if this is from the LaunchMyNFT script
      if (event.reason && event.reason.toString().includes("cancelled")) {
        // Prevent the default browser handling of the error
        event.preventDefault()
        console.log("Handled LaunchMyNFT cancellation:", event.reason)
      }
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    // Clean up
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [ownerId, collectionId])

  return (
    <div className={className}>
      {/* LaunchMyNFT Mint Button Container */}
      <div id="mint-button-container" className="mb-4 min-h-12"></div>

      {/* LaunchMyNFT Mint Counter - Only show if requested */}
      {showCounter && <div id="mint-counter" className="text-center"></div>}

      {/* LaunchMyNFT Scripts */}
      <Script
        src="https://storage.googleapis.com/scriptslmt/0.1.3/solana.js"
        type="module"
        strategy="afterInteractive"
      />
      <link rel="stylesheet" href="https://storage.googleapis.com/scriptslmt/0.1.3/solana.css" />
    </div>
  )
}
