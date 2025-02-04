const startGame = async () => {
  try {
    console.log('Initiating game start request')
    
    const requestData = {
      // Add any game initialization data here
      timestamp: new Date().toISOString()
    }

    console.log('Request payload:', requestData)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rebuttal-royale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData),
    })

    // Log the raw response for debugging
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    // Check if the response is OK
    if (!response.ok) {
      // Try to read the error message from the response
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        // If we can't parse JSON, get the text
        const textResponse = await response.text()
        console.error('Raw error response:', textResponse)
        throw new Error(`HTTP error! status: ${response.status}, body: ${textResponse}`)
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Successful response:', data)
    return data
  } catch (error) {
    console.error('Game start error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    throw error
  }
}

export default function useGame() {
  return {
    startGame
  }
} 