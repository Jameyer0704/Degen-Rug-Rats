"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Check if this is a cancellation error, which we can ignore
    if (error.message && (error.message.includes("cancelled") || error.message.includes("aborted"))) {
      return { hasError: false }
    }

    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Check if this is a cancellation error, which we can ignore
    if (error.message && (error.message.includes("cancelled") || error.message.includes("aborted"))) {
      console.log("Ignoring cancellation error:", error.message)
      return
    }

    console.error("Uncaught error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  public render() {
    if (this.state.hasError) {
      // Check for specific error types
      const errorMessage = this.state.error?.message || "Unknown error"
      const isWalletError = errorMessage.includes("wallet") || errorMessage.includes("phantom")
      const isNetworkError =
        errorMessage.includes("network") || errorMessage.includes("fetch") || errorMessage.includes("API")
      const isCancelledError = errorMessage.includes("cancelled") || errorMessage.includes("aborted")

      // If it's just a cancelled request, don't show an error UI
      if (isCancelledError) {
        // Reset the error state and render children
        this.setState({ hasError: false, error: undefined, errorInfo: undefined })
        return this.props.children
      }

      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 max-w-md">
              <h2 className="text-xl font-orbitron text-rat-primary mb-4">Something went wrong</h2>
              <p className="text-gray-400 mb-4">
                {isWalletError
                  ? "There was an issue connecting to your wallet. Please try again."
                  : isNetworkError
                    ? "Network error. Please check your connection and try again."
                    : "The application encountered an error. Please try refreshing the page."}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-rat-primary text-white px-4 py-2 rounded hover:bg-rat-primary/90"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
