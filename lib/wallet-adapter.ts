// This is a simple adapter for Phantom wallet
// In a production app, you would use @solana/wallet-adapter-react

declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom?: boolean
        connect: () => Promise<{ publicKey: { toString: () => string } }>
        disconnect: () => Promise<void>
      }
    }
  }
}

export const checkIfWalletIsConnected = async () => {
  try {
    if (typeof window !== "undefined") {
      const { solana } = window.phantom || {}

      if (solana?.isPhantom) {
        return true
      }
    }
    return false
  } catch (error) {
    console.error(error)
    return false
  }
}

export const connectWallet = async () => {
  try {
    if (typeof window !== "undefined") {
      const { solana } = window.phantom || {}

      if (solana?.isPhantom) {
        const response = await solana.connect()
        return response.publicKey.toString()
      } else {
        window.open("https://phantom.app/", "_blank")
        return null
      }
    }
    return null
  } catch (error) {
    console.error(error)
    return null
  }
}

export const disconnectWallet = async () => {
  try {
    if (typeof window !== "undefined") {
      const { solana } = window.phantom || {}

      if (solana?.isPhantom) {
        await solana.disconnect()
        return true
      }
    }
    return false
  } catch (error) {
    console.error(error)
    return false
  }
}
