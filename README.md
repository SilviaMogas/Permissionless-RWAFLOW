# Flow Passport - Empowering the Next Generation of Real-World Asset Tokenization

Flow Passport is a revolutionary **DeFi education and tokenized real-world asset (RWA) marketplace** built on the Flow blockchain. Our platform bridges the gap between traditional finance education and decentralized finance through gamified learning experiences, AI-powered investment recommendations, and a curated marketplace of tokenized real-world assets.

## 🌟 Vision & Mission

**Flow Passport** is designed to create a **unified digital identity** that tracks users' financial education journey, investment preferences, and participation in the tokenized asset ecosystem. Our mission is to democratize access to alternative investments while providing comprehensive financial education through innovative blockchain technology.

### Market Opportunity

The Real-World Asset (RWA) tokenization market is experiencing unprecedented growth:
- **Market Size**: $2.3 trillion by 2030 (projected)
- **Current Gap**: Limited educational resources for retail investors
- **Target Audience**: 200M+ potential DeFi users seeking traditional asset exposure
- **Competitive Advantage**: First comprehensive education-to-investment platform

## 🏗️ Project Architecture

```
Flow Passport/
├── RWAFlowApp/           # Next.js 15 Frontend Application
│   ├── app/              # App Router pages and layouts
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks for blockchain interaction
│   ├── lib/              # Utility functions and configurations
│   └── public/           # Static assets
└── RWAFlowContracts/     # Smart Contract Suite
    ├── contracts/        # Solidity smart contracts
    ├── scripts/          # Deployment and verification scripts
    └── test/             # Contract testing suite
```

## 🚀 Core Features

### 🎓 Educational Platform
- **Gamified Learning**: Interactive quizzes with immediate feedback
- **Progressive Curriculum**: Structured learning paths from basics to advanced DeFi
- **Achievement System**: Points and rewards for educational milestones
- **Personalized Content**: AI-driven recommendations based on user progress

### 🤖 AI-Powered Investment Engine
- **Portfolio Analysis**: Intelligent assessment of user investment profiles
- **Risk Assessment**: Comprehensive evaluation of investment readiness
- **Asset Recommendations**: Personalized suggestions based on financial goals
- **Market Insights**: Real-time analysis of RWA market trends

### 🏪 Tokenized Asset Marketplace
- **Curated Assets**: Hand-selected real-world investment opportunities
- **Blockchain Ownership**: Transparent, immutable ownership records
- **Instant Liquidity**: Trade tokenized assets 24/7
- **Global Access**: Invest in international assets from anywhere

### 💳 Integrated Wallet System
- **Privy Integration**: Seamless Web3 onboarding with social logins
- **Multi-Chain Support**: Flow EVM and other blockchain networks
- **Portfolio Tracking**: Real-time balance and performance monitoring
- **Transaction History**: Complete audit trail with block explorer links

## 🛠️ Technology Stack

### Frontend (RWAFlowApp)
- **Framework**: Next.js 15 with App Router
- **UI/UX**: Radix UI components with Tailwind CSS
- **Blockchain**: Wagmi v2 + Viem for Web3 interactions
- **Authentication**: Privy for wallet connection and user management
- **AI Integration**: Anthropic Claude + LangChain for intelligent features
- **State Management**: React Query for server state
- **Styling**: Tailwind CSS with custom design system

### Smart Contracts (RWAFlowContracts)
- **Language**: Solidity 0.8.24
- **Framework**: Hardhat with TypeScript support
- **Security**: OpenZeppelin battle-tested contracts
- **Network**: Flow EVM (Testnet/Mainnet)
- **Verification**: Automatic contract verification on FlowScan

### Key Dependencies
```json
{
  "frontend": {
    "@privy-io/react-auth": "^2.16.0",
    "@ai-sdk/anthropic": "^1.2.12",
    "wagmi": "^2.15.6",
    "viem": "^2.31.4",
    "next": "15.2.4",
    "react": "^19"
  },
  "contracts": {
    "@openzeppelin/contracts": "^5.3.0",
    "hardhat": "^2.25.0",
    "@nomicfoundation/hardhat-toolbox": "^6.0.0"
  }
}
```

## 📱 Platform Components

### Flow Passport Identity System
- **Digital Identity**: Unified profile across all platform features
- **Education Tracking**: Progress monitoring and achievement records
- **Investment History**: Complete portfolio and transaction history
- **Reputation System**: Community-driven credibility scoring
- **Cross-Platform Integration**: Compatible with major DeFi protocols

### Asset Marketplace
Currently featuring 5 premium tokenized assets:

| Asset | Type | Price (USD) | Price (FLOW) | Description |
|-------|------|-------------|--------------|-------------|
| Lisbon Apartment | Real Estate | $500 | 1,500 | Prime European real estate exposure |
| NFT Art Fund | Digital Assets | $300 | 900 | Curated blue-chip NFT collection |
| Brazil Coffee Loan | Commodities | $200 | 600 | Agricultural commodity financing |
| Green Energy Bond | ESG Investment | $1,000 | 3,000 | Sustainable energy infrastructure |
| Corporate Debt Fund | Fixed Income | $750 | 2,250 | Diversified corporate credit exposure |

## 🔗 Smart Contract Architecture

### AssetMarketplace Contract
**Address**: `0xc7403912b47Bd062E1933D40027088ACD5066deD` (Flow Testnet)

**Core Functions**:
- `purchaseAsset()`: Acquire tokenized assets with FLOW
- `hasAsset()`: Check asset ownership status
- `getUserAssets()`: Retrieve user's complete portfolio
- Asset pricing with automatic USD/FLOW conversion (1 USD = 3 FLOW)

**Security Features**:
- ReentrancyGuard protection
- Owner-controlled administrative functions
- Comprehensive event logging
- Safe payment handling with automatic routing

### RWAFlow Token (RWAF)
**Address**: `0x6fBD4A26B44046716e37cD93Db5c47832E276AeB` (Flow Testnet)

**Token Economics**:
- **Total Supply**: 1,000,000,000 RWAF (1 billion)
- **Initial Supply**: 100,000,000 RWAF (100 million)
- **Use Cases**: Platform rewards, governance, premium features
- **Burn Mechanism**: Deflationary tokenomics through usage

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ (v23 supported with warnings)
- npm or yarn package manager
- Flow-compatible wallet (MetaMask, etc.)
- Flow testnet FLOW tokens for testing

### Frontend Setup
```bash
# Clone the repository
git clone <repository-url>
cd Flow-Passport/RWAFlowApp

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Smart Contract Deployment
```bash
# Navigate to contracts directory
cd ../RWAFlowContracts

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your DEPLOY_WALLET_1 private key

# Compile contracts
npm run compile

# Deploy to Flow Testnet
npm run deploy:marketplace
```

### Environment Configuration

**Frontend (.env)**:
```env
# Contract addresses
NEXT_PUBLIC_ASSET_MARKETPLACE_CONTRACT_ADDRESS=0xc7403912b47Bd062E1933D40027088ACD5066deD
NEXT_PUBLIC_RWAFLOW_TOKEN_ADDRESS=0x6fBD4A26B44046716e37cD93Db5c47832E276AeB

# Flow network configuration
NEXT_PUBLIC_FLOW_TESTNET_RPC=https://testnet.evm.nodes.onflow.org
NEXT_PUBLIC_FLOW_TESTNET_CHAIN_ID=545

# Platform configuration
USD_TO_FLOW_RATE=3

# AI integration (optional)
ANTHROPIC_API_KEY=your_key_here
```

**Smart Contracts (.env)**:
```env
# Deployment wallet private key (without 0x prefix)
DEPLOY_WALLET_1=your_private_key_here

# Contract verification
ETHERSCAN_API_KEY=your_flowscan_api_key
```

## 🧪 Testing & Verification

### Contract Testing
```bash
# Run comprehensive test suite
npm test

# Check deployed contract status
npm run check:marketplace

# Test asset purchase functionality
npm run test:purchase <CONTRACT_ADDRESS> <ASSET_ID>
```

### Frontend Testing
```bash
# Run development server
npm run dev

# Access at http://localhost:3000
# Connect wallet and test marketplace functionality
```

### Contract Verification
All contracts are automatically verified during deployment. For manual verification:
```bash
npx hardhat verify --network flowTestnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## 🔐 Security & Compliance

### Smart Contract Security
- **OpenZeppelin Standards**: Industry-standard security patterns
- **Reentrancy Protection**: Guards against common attack vectors
- **Access Control**: Owner-only administrative functions
- **Input Validation**: Comprehensive parameter checking
- **Event Logging**: Complete audit trail for all transactions

### Platform Security
- **Wallet Integration**: Secure Web3 authentication via Privy
- **Data Protection**: Local storage with encryption for sensitive data
- **API Security**: Rate limiting and input sanitization
- **Frontend Security**: XSS protection and secure headers

## 🌐 Network Information

### Flow Testnet
- **Chain ID**: 545
- **RPC URL**: https://testnet.evm.nodes.onflow.org
- **Block Explorer**: https://evm-testnet.flowscan.io
- **Faucet**: https://testnet-faucet.onflow.org

### Flow Mainnet
- **Chain ID**: 747
- **RPC URL**: https://mainnet.evm.nodes.onflow.org
- **Block Explorer**: https://evm.flowscan.io

## 📊 Platform Analytics

### User Journey Tracking
- Educational progress and completion rates
- Asset discovery and purchase patterns
- Wallet connection and transaction success rates
- AI recommendation effectiveness metrics

### Performance Metrics
- Transaction throughput and confirmation times
- Smart contract gas optimization
- Frontend performance and user experience
- Platform uptime and reliability

## 🛣️ Roadmap

### Q1 2025
- [ ] Enhanced AI investment recommendations
- [ ] Additional tokenized asset categories
- [ ] Multi-language platform support
- [ ] Advanced portfolio analytics

### Q2 2025
- [ ] Cross-chain asset support
- [ ] Lending/borrowing against tokenized assets
- [ ] DAO governance implementation
- [ ] Institutional investor onboarding

### Q3 2025
- [ ] Mobile application launch
- [ ] Automated market maker for asset trading
- [ ] Integration with traditional finance APIs
- [ ] Advanced educational content partnerships

## 🤝 Contributing

We welcome contributions from the community! Please see our contributing guidelines for details on:
- Code standards and review process
- Security considerations
- Testing requirements
- Documentation standards

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links & Resources

- **Website**: [Flow Passport Platform](https://flowpassport.com)
- **Documentation**: [Developer Docs](https://docs.flowpassport.com)
- **Community**: [Discord](https://discord.gg/flowpassport)
- **Twitter**: [@FlowPassport](https://twitter.com/flowpassport)
- **FlowScan**: [Contract Explorer](https://evm-testnet.flowscan.io)

## 💡 Support

For technical support, questions, or partnership inquiries:
- **Email**: support@flowpassport.com
- **Discord**: Join our community for real-time help
- **GitHub Issues**: Report bugs and feature requests

---

**Flow Passport** - Bridging Traditional Finance and DeFi Through Education and Innovation 🌊