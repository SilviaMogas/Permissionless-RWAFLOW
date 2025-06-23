import { NextRequest, NextResponse } from 'next/server'
import { createFlowAgent } from '@/lib/agent-config'

export async function POST(request: NextRequest) {
  try {
    const { message, userAddress, sessionId } = await request.json()

    // Validate required fields
    if (!message || !userAddress) {
      return NextResponse.json(
        { error: 'Message and userAddress are required' },
        { status: 400 }
      )
    }

    // Validate environment variables
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured' },
        { status: 500 }
      )
    }

    // Create agent instance
    const agent = createFlowAgent()

    // Create a unique thread ID for this conversation
    const threadId = sessionId || `thread_${userAddress}_${Date.now()}`

    // Prepare context for the agent
    const context = {
      userAddress,
      timestamp: new Date().toISOString(),
      platform: 'Flow Passport',
      network: 'Flow Testnet (545)'
    }

    // Add context to the message
    const contextualMessage = `User context: ${JSON.stringify(context)}\n\nUser message: ${message}`

    // Invoke the agent
    const response = await agent.invoke(
      {
        messages: [
          {
            role: 'user',
            content: contextualMessage
          }
        ]
      },
      {
        configurable: {
          thread_id: threadId
        }
      }
    )

    // Extract the agent's response
    const agentMessage = response.messages[response.messages.length - 1]
    const agentResponse = agentMessage.content

    return NextResponse.json({
      success: true,
      response: agentResponse,
      sessionId: threadId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Agent chat error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}