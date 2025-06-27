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

### 🎓 Educational Platform with NFT Certification
- **Gamified Learning**: Interactive quizzes with immediate feedback
- **Progressive Curriculum**: 3-level structured learning (Beginner → Intermediate → Advanced)
- **NFT Certificates**: Soulbound certificate NFTs for users who pass with 50%+ scores
- **Achievement System**: Blockchain-verified completion status and rewards
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

### Flow Passport Identity System with Account Abstraction
- **Master Membership NFT**: Single soulbound NFT representing user's digital identity
- **Hierarchical NFT Structure**: Child NFTs for certificates and asset ownership linked to membership
- **Automated Wallet Creation**: Account abstraction enables seamless onboarding without wallet complexity
- **Unified Profile**: All achievements, assets, and interactions tied to one membership identity
- **Reputation System**: Dynamic scoring based on educational progress and investment activity
- **Cross-Platform Integration**: Compatible with major DeFi protocols and account abstraction providers

### Academy NFT Certification System
A comprehensive certification system that rewards educational achievement:

| Module | Level | Questions | Pass Rate | Certificate NFT |
|--------|-------|-----------|-----------|-----------------|
| Beginner RWA Quiz | 1 | 10 | 50%+ | Beginner Certificate |
| Intermediate RWA Quiz | 2 | 25 | 50%+ | Intermediate Certificate |
| Advanced RWA Quiz | 3 | 25 | 50%+ | Advanced Certificate |

**Features**:
- **Quiz Locking System**: Completed quizzes are locked to prevent retaking
- **Final Score Display**: Shows percentage score for passed quizzes (e.g., "Final Score: 85%")
- **NFT Explorer Integration**: Direct links to view certificate NFTs on FlowScan block explorer
- **One-Click NFT Minting**: Seamless certificate minting for eligible users
- Soulbound (non-transferable) certificate NFTs
- Automatic exam result submission to blockchain
- Real-time pass/fail verification
- Visual completion indicators in UI
- Prevents duplicate certificates per module

**User Experience Enhancements**:
- **Locked Quiz Display**: Completed quizzes show with reduced opacity and are non-clickable
- **Score Badges**: Green badges display final scores prominently
- **NFT Action Buttons**: 
  - "View NFT in Explorer" button for users who have minted certificates
  - "Mint Certificate NFT" button for users who passed but haven't minted yet
- **Smart Status Indicators**: Dynamic status showing pass/fail, NFT availability, and completion status

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

### V2 Account Abstraction Contracts

#### FlowPassportMembership Contract (Master NFT)
**Address**: `0x04788614eecB86a9eEF39928D8dafBfAe54476a8` (Flow Testnet)
**Purpose**: Issues soulbound membership NFTs representing user identity

**Core Functions**:
- `createMembership()`: Mint membership NFT on first user interaction
- `getMembershipInfo()`: Retrieve complete user profile and reputation
- `updateReputationScore()`: Dynamic reputation updates based on activity
- `incrementCertificateCount()`: Track educational achievements
- `incrementAssetCount()`: Track investment portfolio growth

#### FlowPassportRegistry Contract (Central Hub)
**Address**: `0xdf03552Dd7afB410DE95E3c810AB7b39299904E7` (Flow Testnet)
**Purpose**: Manages hierarchical NFT relationships and user profiles

**Core Functions**:
- `createOrLinkMembership()`: Auto-create membership for new users
- `addChildNFT()`: Link certificates and assets as child NFTs
- `getUserProfile()`: Get complete user profile with child NFTs
- `getCompleteUserProfile()`: Unified view of certificates and assets
- `authorizeContract()`: Manage which contracts can create child NFTs

#### AcademyCertificationV2 Contract
**Address**: `0x525715A1BcC513F66Eecea513652fc294833ef6C` (Flow Testnet)
**Purpose**: Enhanced academy system with automatic membership integration

**Core Functions**:
- `submitExamResult()`: Record exam scores and auto-create child NFTs
- `hasPassedModule()`: Check if user passed a specific module
- `getExamResult()`: Retrieve detailed exam results
- Integration with registry for automatic certificate linking

#### AssetMarketplaceV2 Contract
**Address**: `0xc4951B1C022A29b4dCdbB3DE06e5C2f7A5767501` (Flow Testnet)
**Purpose**: Enhanced marketplace with membership integration

**Core Functions**:
- `purchaseAsset()`: Buy assets and auto-create child NFTs
- `hasAsset()`: Check asset ownership status
- `getUserAssets()`: Retrieve user's complete portfolio
- Automatic membership creation and asset linking

### Legacy V1 Contracts (Deprecated)

#### AssetMarketplace Contract (V1)
**Address**: `0xc7403912b47Bd062E1933D40027088ACD5066deD` (Flow Testnet)

#### AcademyCertification Contract (V1)
**Address**: `0x66206f19Ca68C1B6286673ED3E7500AD50827df2` (Flow Testnet)

#### AcademyNFT Contract (V1)
**Address**: `0xA5AC23d9f4EDc3068081D08214aa2D8fA7de7f4B` (Flow Testnet)

### RWAFlow Token (RWAF)
**Address**: `0x6fBD4A26B44046716e37cD93Db5c47832E276AeB` (Flow Testnet)

**Token Economics**:
- **Total Supply**: 1,000,000,000 RWAF (1 billion)
- **Initial Supply**: 100,000,000 RWAF (100 million)
- **Use Cases**: Platform rewards, governance, premium features
- **Burn Mechanism**: Deflationary tokenomics through usage

### Security Features (All Contracts)
- **OpenZeppelin Standards**: Battle-tested security patterns
- **ReentrancyGuard Protection**: Prevents reentrancy attacks
- **Owner Controls**: Administrative functions restricted to contract owners
- **Soulbound NFTs**: Membership and certificates are non-transferable
- **Access Control**: Registry-based authorization for child NFT creation
- **Hierarchical Validation**: Child NFTs can only be created by authorized contracts
- **Duplicate Prevention**: One membership per user, one certificate per module
- **Account Abstraction Security**: Secure wallet creation and management

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

# Deploy marketplace contracts
npm run deploy:marketplace

# Deploy academy certification system
npm run deploy:academy
```

### Environment Configuration

**Frontend (.env)**:
```env
# V2 Account Abstraction Contracts (Recommended)
NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS=0x04788614eecB86a9eEF39928D8dafBfAe54476a8
NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS=0xdf03552Dd7afB410DE95E3c810AB7b39299904E7
NEXT_PUBLIC_ACADEMY_V2_CONTRACT_ADDRESS=0x525715A1BcC513F66Eecea513652fc294833ef6C
NEXT_PUBLIC_MARKETPLACE_V2_CONTRACT_ADDRESS=0xc4951B1C022A29b4dCdbB3DE06e5C2f7A5767501

# Legacy V1 Contracts (Backwards Compatibility)
NEXT_PUBLIC_ASSET_MARKETPLACE_CONTRACT_ADDRESS=0xc7403912b47Bd062E1933D40027088ACD5066deD
NEXT_PUBLIC_RWAFLOW_TOKEN_ADDRESS=0x6fBD4A26B44046716e37cD93Db5c47832E276AeB
NEXT_PUBLIC_ACADEMY_CERTIFICATION_ADDRESS=0x66206f19Ca68C1B6286673ED3E7500AD50827df2
NEXT_PUBLIC_ACADEMY_NFT_ADDRESS=0xA5AC23d9f4EDc3068081D08214aa2D8fA7de7f4B

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

# Test academy certification system
npm run test:academy <CERTIFICATION_ADDRESS> <NFT_ADDRESS>
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
- [x] NFT Certification System for Academy modules
- [x] Quiz locking system to prevent retaking completed modules
- [x] Final score display with percentage badges
- [x] NFT Explorer integration with FlowScan block explorer
- [x] One-click NFT certificate minting functionality
- [x] **Account Abstraction Integration**: Master membership NFTs with hierarchical structure
- [x] **V2 Smart Contracts**: Enhanced contracts with automatic membership creation
- [x] **Unified Identity System**: Single membership NFT linking all user activities
- [x] **Contract Deployment**: All V2 contracts deployed and tested on Flow Testnet
- [x] **Hierarchical NFT System**: Child NFTs for certificates and assets linked to membership
- [ ] Enhanced AI investment recommendations
- [ ] Additional tokenized asset categories
- [ ] Multi-language platform support
- [ ] Advanced portfolio analytics
- [ ] Account abstraction provider integration (Biconomy, Gelato, etc.)
- [ ] Gasless transaction implementation
- [ ] Frontend migration to V2 contracts

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

- **Live Application**: [Flow Passport Platform](https://flow-passport.vercel.app/)
- **Pitch Deck**: [Project Presentation](https://www.canva.com/design/DAGrIUspFyc/vcwA0SHoc4inO0rgCk_rcw/edit)
- **FlowScan**: [Smart Contract Explorer](https://evm-testnet.flowscan.io)
- **V2 Contracts on FlowScan**:
  - [FlowPassportMembership](https://evm-testnet.flowscan.io/address/0x04788614eecB86a9eEF39928D8dafBfAe54476a8)
  - [FlowPassportRegistry](https://evm-testnet.flowscan.io/address/0xdf03552Dd7afB410DE95E3c810AB7b39299904E7)
  - [AcademyCertificationV2](https://evm-testnet.flowscan.io/address/0x525715A1BcC513F66Eecea513652fc294833ef6C)
  - [AssetMarketplaceV2](https://evm-testnet.flowscan.io/address/0xc4951B1C022A29b4dCdbB3DE06e5C2f7A5767501)
- **Community**: [Discord](https://discord.gg/flowpassport)
- **Twitter**: [@FlowPassport](https://twitter.com/flowpassport)

## 💡 Support

For technical support, questions, or partnership inquiries:
- **Email**: support@flowpassport.com
- **Discord**: Join our community for real-time help
- **GitHub Issues**: Report bugs and feature requests

---

**Flow Passport** - Bridging Traditional Finance and DeFi Through Education and Innovation 🌊