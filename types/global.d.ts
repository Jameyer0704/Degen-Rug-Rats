interface Window {
  ownerId?: string
  collectionId?: string
  phantom?: {
    solana?: {
      isPhantom?: boolean
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>
      disconnect: () => Promise<void>
    }
  }
}
