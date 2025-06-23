import { ChatAnthropic } from '@langchain/anthropic'
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { MemorySaver } from '@langchain/langgraph'
import { DynamicTool } from '@langchain/core/tools'
import { z } from 'zod'

// Flow AgentKit configuration
export const flowAgentConfig = {
  model: process.env.AGENT_MODEL || 'claude-3-5-haiku-20241022',
  temperature: parseFloat(process.env.AGENT_TEMPERATURE || '0.1'),
  maxTokens: parseInt(process.env.AGENT_MAX_TOKENS || '1000'),
  flowTestnetRPC: process.env.FLOW_TESTNET_RPC_URL || 'https://testnet.evm.nodes.onflow.org',
  flowMainnetRPC: process.env.FLOW_MAINNET_RPC_URL || 'https://mainnet.evm.nodes.onflow.org',
}

// Initialize Claude model (only when API key is available)
export const llm = process.env.ANTHROPIC_API_KEY ? new ChatAnthropic({
  model: flowAgentConfig.model,
  temperature: flowAgentConfig.temperature,
  maxTokens: flowAgentConfig.maxTokens,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
}) : null

// Flow-specific tools for RWA investment advisor
export const investmentTools = [
  new DynamicTool({
    name: 'get_portfolio_balance',
    description: 'Get the current portfolio balance and asset allocation for a user',
    schema: z.object({
      userAddress: z.string().describe('User wallet address'),
    }),
    func: async ({ userAddress }) => {
      // Mock portfolio data - in production this would connect to Flow blockchain
      const portfolios = {
        'default': {
          totalValue: 15750.25,
          assets: [
            { name: 'Tokenized Real Estate', value: 8500, percentage: 54 },
            { name: 'Art Collection Tokens', value: 3200, percentage: 20 },
            { name: 'Agricultural Assets', value: 2800, percentage: 18 },
            { name: 'Green Energy Bonds', value: 1250.25, percentage: 8 }
          ],
          flowBalance: 125.75
        }
      }
      
      const portfolio = portfolios['default'] || portfolios['default']
      
      return JSON.stringify({
        address: userAddress,
        totalValue: portfolio.totalValue,
        assets: portfolio.assets,
        flowBalance: portfolio.flowBalance,
        lastUpdated: new Date().toISOString()
      })
    }
  }),

  new DynamicTool({
    name: 'get_market_data',
    description: 'Get current market data for RWA tokens and investment opportunities',
    schema: z.object({
      assetType: z.string().optional().describe('Specific asset type to query (optional)'),
    }),
    func: async ({ assetType }) => {
      // Mock market data - in production this would fetch real market data
      const marketData = {
        'Real Estate': { price: 125.50, change24h: 2.3, apy: 6.8, liquidity: 'High' },
        'Art': { price: 89.75, change24h: -0.8, apy: 4.2, liquidity: 'Medium' },
        'Agriculture': { price: 45.20, change24h: 1.5, apy: 8.1, liquidity: 'Medium' },
        'Energy': { price: 156.80, change24h: 3.2, apy: 7.5, liquidity: 'High' },
        'Debt': { price: 100.05, change24h: 0.1, apy: 5.5, liquidity: 'High' }
      }

      if (assetType && marketData[assetType]) {
        return JSON.stringify({
          assetType,
          data: marketData[assetType],
          timestamp: new Date().toISOString()
        })
      }

      return JSON.stringify({
        marketOverview: marketData,
        totalMarketCap: 2.8e9,
        dailyVolume: 45.2e6,
        timestamp: new Date().toISOString()
      })
    }
  }),

  new DynamicTool({
    name: 'analyze_risk_profile',
    description: 'Analyze user risk profile and provide personalized investment recommendations',
    schema: z.object({
      userAddress: z.string().describe('User wallet address'),
      riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']).optional(),
    }),
    func: async ({ userAddress, riskTolerance }) => {
      // Mock risk analysis - in production this would analyze user behavior and preferences
      const riskProfiles = {
        conservative: {
          recommendedAllocation: {
            'Debt Instruments': 60,
            'Real Estate': 30,
            'Energy': 10
          },
          maxSingleAsset: 30,
          expectedReturn: '5-7%',
          riskLevel: 'Low'
        },
        moderate: {
          recommendedAllocation: {
            'Real Estate': 40,
            'Energy': 25,
            'Agriculture': 20,
            'Debt Instruments': 15
          },
          maxSingleAsset: 40,
          expectedReturn: '7-10%',
          riskLevel: 'Medium'
        },
        aggressive: {
          recommendedAllocation: {
            'Art': 35,
            'Agriculture': 30,
            'Real Estate': 20,
            'Energy': 15
          },
          maxSingleAsset: 50,
          expectedReturn: '10-15%',
          riskLevel: 'High'
        }
      }

      const profile = riskProfiles[riskTolerance || 'moderate']
      
      return JSON.stringify({
        userAddress,
        riskTolerance: riskTolerance || 'moderate',
        analysis: profile,
        recommendations: [
          'Diversify across multiple asset classes',
          'Consider dollar-cost averaging for entries',
          'Monitor and rebalance quarterly',
          'Stay informed about regulatory changes'
        ],
        timestamp: new Date().toISOString()
      })
    }
  }),

  new DynamicTool({
    name: 'get_learning_progress',
    description: 'Get user learning progress and suggest educational content',
    schema: z.object({
      userAddress: z.string().describe('User wallet address'),
    }),
    func: async ({ userAddress }) => {
      // Mock learning data - in production this would track actual user progress
      const learningData = {
        completedQuizzes: 8,
        totalQuizzes: 15,
        currentLevel: 'Intermediate',
        xpPoints: 2450,
        achievements: ['RWA Basics', 'Tokenization Expert', 'Risk Assessment'],
        suggestedNext: [
          'Advanced Portfolio Optimization',
          'DeFi Integration Strategies',
          'Regulatory Compliance'
        ],
        nftLevel: 3
      }

      return JSON.stringify({
        userAddress,
        progress: learningData,
        recommendations: [
          'Complete the Advanced RWA quiz to unlock new NFT traits',
          'Practice portfolio rebalancing in the simulator',
          'Read about upcoming regulatory changes'
        ],
        timestamp: new Date().toISOString()
      })
    }
  })
]

// System message for the Flow RWA investment advisor
export const systemMessage = `You are FlowBot, an AI investment advisor specialized in Real World Assets (RWAs) on the Flow blockchain. You help users navigate tokenized investments, portfolio management, and educational content.

## Your Capabilities:
- Portfolio analysis and recommendations
- Real-time market data for RWA tokens
- Risk assessment and personalized allocation strategies
- Educational guidance and learning progress tracking
- Flow blockchain transaction insights

## Your Personality:
- Professional yet approachable
- Data-driven but explains concepts clearly
- Focuses on education and responsible investing
- Emphasizes risk management and diversification

## Key Rules:
1. Always prioritize user education and risk awareness
2. Provide specific, actionable advice based on user data
3. Mention relevant educational resources when appropriate
4. Be concise but thorough in explanations
5. Always disclose when data is simulated or estimated
6. Encourage diversification and long-term thinking

## Flow Context:
- You operate on Flow testnet (Chain ID: 545)
- Focus on tokenized real-world assets (real estate, art, agriculture, energy, debt)
- Users can earn XP, Flow tokens, and evolve NFTs through learning
- Platform emphasizes education-first approach to investing

When users ask questions, use the available tools to get current data and provide personalized, actionable advice.`

// Create the agent with memory
export const createFlowAgent = () => {
  if (!llm) {
    throw new Error('Anthropic API key not configured')
  }
  
  const checkpointer = new MemorySaver()
  
  return createReactAgent({
    llm,
    tools: investmentTools,
    checkpointSaver: checkpointer,
    systemMessage,
  })
}