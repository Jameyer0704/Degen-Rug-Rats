import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

// Create a map to store abort controllers for each request
const abortControllers = new Map<string, AbortController>()

export async function getChatResponse(message: string, requestId?: string) {
  // Generate a unique ID for this request if not provided
  const id = requestId || Math.random().toString(36).substring(2, 9)

  // Cancel any previous request with the same ID
  if (abortControllers.has(id)) {
    try {
      abortControllers.get(id)?.abort()
    } catch (err) {
      console.error("Error aborting previous request:", err)
    }
  }

  // Create a new AbortController for this request
  const controller = new AbortController()
  abortControllers.set(id, controller)

  // Set a timeout to abort the request if it takes too long
  const timeoutId = setTimeout(() => {
    if (abortControllers.has(id)) {
      try {
        controller.abort("Request timeout")
        abortControllers.delete(id)
        console.log(`Request ${id} timed out and was aborted`)
      } catch (err) {
        console.error(`Error aborting timed out request ${id}:`, err)
      }
    }
  }, 8000) // 8 second timeout

  try {
    // Wrap the entire generateText call in a try/catch to handle all possible errors
    let result
    try {
      result = await generateText({
        model: groq("llama3-70b-8192"),
        prompt: `You are "SewerKing", the edgy, foul-mouthed mascot for the Degen Rug-Rats community, a Solana token and NFT project. 
        Your personality is aggressive, enthusiastic about crypto gains, and you speak in sewer/rat slang.
        
        The token symbol is $DEGEN and the contract address is G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump.
        
        Important facts:
        - Total supply is 1,000,000,000 $DEGEN
        - Token holders get access to an exclusive "early alpha rugging community" on Discord
        - There are 89 total NFTs (69 standard, 20 1:1 special editions)
        - NFT mint price is 0.1 SOL
        - The project is a fair launch with no dev/team/community tokens
        
        IMPORTANT: Keep your responses EXTREMELY SHORT (2-5 lines maximum). Be concise, direct, and edgy.
        Your goal is to AGGRESSIVELY promote buying the token or NFTs. Use FOMO tactics, mention potential gains, and push people to join the community.
        
        Respond to the following user message in your edgy SewerKing persona:
        
        User message: ${message}`,
        maxTokens: 200,
        signal: controller.signal,
      })
    } catch (error) {
      // Handle any errors from generateText
      if (error.name === "AbortError" || (error.message && error.message.includes("cancelled"))) {
        console.log("Request was cancelled during generateText")
        return "Request cancelled. Try again, ya filthy rat!"
      }

      console.error("Error in generateText:", error)
      return "Yo, the sewers are clogged right now! Try again later, ya filthy rat!"
    }

    // Clear the timeout since we got a response
    clearTimeout(timeoutId)

    // Clean up the controller
    abortControllers.delete(id)

    return result.text || "YO! Something's up with my brain. Try again, rat!"
  } catch (error) {
    // This is a fallback catch for any other errors
    // Clear the timeout
    clearTimeout(timeoutId)

    // Clean up the controller
    abortControllers.delete(id)

    // Handle different types of errors
    if (error.name === "AbortError" || (error.message && error.message.includes("cancelled"))) {
      console.log("Request was cancelled in outer catch")
      return "Request cancelled. Try again, ya filthy rat!"
    }

    console.error("Error generating AI response:", error)
    return "Yo, the sewers are clogged right now! Try again later, ya filthy rat!"
  }
}

// Function to cancel an ongoing request
export function cancelChatRequest(requestId: string) {
  const controller = abortControllers.get(requestId)
  if (controller) {
    try {
      controller.abort()
      abortControllers.delete(requestId)
      console.log(`Request ${requestId} cancelled`)
    } catch (err) {
      console.error(`Error cancelling request ${requestId}:`, err)
    }
  }
}

// Function to cancel all ongoing requests
export function cancelAllChatRequests() {
  try {
    abortControllers.forEach((controller, id) => {
      try {
        controller.abort()
        console.log(`Request ${id} cancelled`)
      } catch (err) {
        console.error(`Error cancelling request ${id}:`, err)
      }
    })
    abortControllers.clear()
  } catch (err) {
    console.error("Error in cancelAllChatRequests:", err)
  }
}
