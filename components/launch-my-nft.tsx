"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

interface LaunchMyNFTProps {
  ownerId?: string
  collectionId?: string
}

export default function LaunchMyNFT({
  ownerId = "Aq6YoBjyDow9SajNHRsk6u4Yx1EirxgufB4SQSyDjLww",
  collectionId = "dM7WPNgIA0hj5aCvevc2",
}: LaunchMyNFTProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Only run in browser environment
      if (typeof window === "undefined") return

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
    } catch (error) {
      console.error("Error setting LaunchMyNFT variables:", error)
      setScriptError("Failed to initialize mint variables")
    }
  }, [ownerId, collectionId])

  return (
    <div className="w-full">
      {scriptError && <div className="text-red-500 mb-4 p-2 bg-red-500/10 rounded-md text-center">{scriptError}</div>}

      {/* LaunchMyNFT Mint Button Container */}
      <div id="mint-button-container" className="mb-4 min-h-12"></div>

      {/* LaunchMyNFT Mint Counter */}
      <div id="mint-counter" className="text-center"></div>

      {/* LaunchMyNFT Scripts */}
      <Script
        src="https://storage.googleapis.com/scriptslmt/0.1.3/solana.js"
        type="module"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={(e) => {
          console.error("LaunchMyNFT script error:", e)
          setScriptError("Failed to load mint script")
        }}
      />
      <link rel="stylesheet" href="https://storage.googleapis.com/scriptslmt/0.1.3/solana.css" />

      {!scriptLoaded && (
        <div className="text-center">
          <div className="animate-pulse bg-gray-700 h-10 w-full rounded-md mb-2"></div>
          <div className="text-gray-400 text-sm">Loading mint functionality...</div>
        </div>
      )}
    </div>
  )
}
