import { NextRequest, NextResponse } from 'next/server'
import { createFlowAgent } from '@/lib/agent-config'

export async function POST(request: NextRequest) {
  try {
    const { onboardingData, userAddress } = await request.json()

    // Validate required fields
    if (!onboardingData) {
      return NextResponse.json(
        { error: 'Onboarding data is required' },
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

    // Create specialized prompt for portfolio recommendations
    const portfolioPrompt = `Based on the user's onboarding responses, provide a comprehensive portfolio recommendation for tokenized Real World Assets (RWAs) on Flow blockchain.

User Profile:
- Experience Level: ${onboardingData.experience || 'Not specified'}
- Investment Goal: ${onboardingData.goal || 'Not specified'}
- Risk Tolerance: ${onboardingData.risk || 'Not specified'}
- Preferred Assets: ${onboardingData.assets ? onboardingData.assets.join(', ') : 'Not specified'}
- Investment Amount: ${onboardingData.investmentAmount || 'Not specified'}

Please provide:
1. A clear investment strategy summary (2-3 sentences)
2. Specific asset allocation percentages with rationale
3. Risk assessment and mitigation strategies
4. Expected returns and timeline
5. Next steps and actionable recommendations

Focus on RWA categories: Real Estate, Art, Agriculture, Energy, and Debt Instruments.
Be specific, actionable, and educational. Explain WHY these recommendations make sense for this user profile.`

    // Create a unique thread ID for this recommendation
    const threadId = `portfolio_rec_${userAddress || 'anonymous'}_${Date.now()}`

    // Invoke the agent with portfolio-specific context
    const response = await agent.invoke(
      {
        messages: [
          {
            role: 'user',
            content: portfolioPrompt
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
    const recommendation = agentMessage.content

    return NextResponse.json({
      success: true,
      recommendation,
      userProfile: {
        experience: onboardingData.experience,
        goal: onboardingData.goal,
        risk: onboardingData.risk,
        assets: onboardingData.assets,
        investmentAmount: onboardingData.investmentAmount
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Portfolio recommendation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate portfolio recommendation',
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