# MCP Flow Server - Flow Testnet Deployment Guide

## Overview
This guide provides comprehensive information for MCP Flow Server to automatically deploy Flow Passport contracts to Flow Testnet.

## Quick Deployment Commands

### Prerequisites Setup
```bash
# Ensure Node.js 18.x (avoid 23.x)
node --version

# Install dependencies
npm install

# Set environment variables
export DEPLOY_WALLET_1="your_private_key_without_0x"
export ETHERSCAN_API_KEY="any_string"  # Optional for verification
```

### Deploy V2 Account Abstraction System (Recommended)
```bash
# Compile contracts
npm run compile

# Deploy complete V2 system
npx hardhat run scripts/deploy-membership-v2.js --network flowTestnet

# Test deployment
node scripts/test-membership-system.js
```

### Deploy Legacy V1 Contracts
```bash
# Deploy marketplace
npx hardhat run scripts/deploy-marketplace.js --network flowTestnet

# Deploy academy
npx hardhat run scripts/deploy-academy.js --network flowTestnet
```

## Network Configuration

### Flow Testnet Details
- **RPC URL**: `https://testnet.evm.nodes.onflow.org`
- **Chain ID**: `545`
- **Currency**: `FLOW`
- **Block Explorer**: `https://evm-testnet.flowscan.io`
- **Faucet**: `https://testnet-faucet.onflow.org`

### Hardhat Configuration Required
```javascript
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    flowTestnet: {
      url: 'https://testnet.evm.nodes.onflow.org',
      accounts: process.env.DEPLOY_WALLET_1 ? [process.env.DEPLOY_WALLET_1] : [],
      chainId: 545,
    },
  },
  etherscan: {
    apiKey: {
      flowTestnet: "any-string",
    },
    customChains: [
      {
        network: "flowTestnet",
        chainId: 545,
        urls: {
          apiURL: "https://evm-testnet.flowscan.io/api",
          browserURL: "https://evm-testnet.flowscan.io/",
        },
      },
    ],
  },
};
```

## Deployed Contract Addresses

### V2 Account Abstraction Contracts (Current)
| Contract | Address | Purpose |
|----------|---------|---------|
| FlowPassportMembership | `0x04788614eecB86a9eEF39928D8dafBfAe54476a8` | Master membership NFT |
| FlowPassportRegistry | `0xdf03552Dd7afB410DE95E3c810AB7b39299904E7` | Central registry hub |
| AcademyCertificationV2 | `0x525715A1BcC513F66Eecea513652fc294833ef6C` | Enhanced academy |
| AssetMarketplaceV2 | `0xc4951B1C022A29b4dCdbB3DE06e5C2f7A5767501` | Enhanced marketplace |

### V1 Legacy Contracts
| Contract | Address | Purpose |
|----------|---------|---------|
| AssetMarketplace | `0xc7403912b47Bd062E1933D40027088ACD5066deD` | Original marketplace |
| RWAFlowToken | `0x6fBD4A26B44046716e37cD93Db5c47832E276AeB` | Platform token |
| AcademyCertification | `0x66206f19Ca68C1B6286673ED3E7500AD50827df2` | Original academy |
| AcademyNFT | `0xA5AC23d9f4EDc3068081D08214aa2D8fA7de7f4B` | Academy certificates |

## Deployment Sequence

### V2 System Deployment Order
1. **FlowPassportMembership** - Master membership NFT contract
2. **FlowPassportRegistry** - Central registry for relationships
3. **Link Contracts** - Set registry in membership contract
4. **AcademyCertificationV2** - Enhanced academy with auto-membership
5. **AssetMarketplaceV2** - Enhanced marketplace with auto-membership
6. **Authorize Contracts** - Enable V2 contracts in registry

### Constructor Arguments
```javascript
// FlowPassportMembership
[deployer.address, "https://flowpassport.com/api/metadata/"]

// FlowPassportRegistry  
[deployer.address, membershipAddress]

// AcademyCertificationV2
[deployer.address, registryAddress]

// AssetMarketplaceV2
[deployer.address, registryAddress]
```

## Error Handling

### Common Issues & Solutions

#### 1. Headers Timeout Error
```javascript
// Problem: HeadersTimeoutError during deployment
// Solution: Implement retry mechanism
async function deployWithRetry(contractFactory, args, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const contract = await contractFactory.deploy(...args);
      await contract.waitForDeployment();
      return contract;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 5000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

#### 2. Contract Verification Failure
```bash
# Problem: "The address is not a smart contract"
# Solution: Wait longer before verification
await new Promise(resolve => setTimeout(resolve, 15000));
```

#### 3. Node.js Version Warning
```bash
# Problem: "Node.js v23.x not supported by Hardhat"
# Solution: Use Node.js v18.x or v20.x
nvm use 18
```

## Testing Deployment

### Basic Functionality Test
```javascript
// Test membership creation
const testUser = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const tx = await registryContract.createOrLinkMembership(testUser);
await tx.wait();

// Verify membership
const hasMembership = await membershipContract.hasMembership(testUser);
const tokenId = await membershipContract.getMembershipTokenId(testUser);
```

### Integration Test Flow
1. Create membership for test user
2. Submit exam result (auto-creates certificate child NFT)
3. Purchase asset (auto-creates asset child NFT)
4. Query complete user profile
5. Verify reputation score updates

## Frontend Integration

### Environment Variables to Set
```env
# V2 Account Abstraction Contracts
NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS=0x04788614eecB86a9eEF39928D8dafBfAe54476a8
NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS=0xdf03552Dd7afB410DE95E3c810AB7b39299904E7
NEXT_PUBLIC_ACADEMY_V2_CONTRACT_ADDRESS=0x525715A1BcC513F66Eecea513652fc294833ef6C
NEXT_PUBLIC_MARKETPLACE_V2_CONTRACT_ADDRESS=0xc4951B1C022A29b4dCdbB3DE06e5C2f7A5767501

# Network Configuration
NEXT_PUBLIC_FLOW_TESTNET_RPC=https://testnet.evm.nodes.onflow.org
NEXT_PUBLIC_FLOW_TESTNET_CHAIN_ID=545
```

## Account Abstraction Features

### Master Membership NFT
- **Soulbound**: Non-transferable identity NFT
- **Reputation**: Dynamic scoring (start: 100, +50 certificates, +25 assets)
- **Profile**: Complete user metadata and achievement tracking
- **Auto-Creation**: Minted on first platform interaction

### Hierarchical Child NFTs
- **Certificates**: Created when user passes academy exams (50%+ score)
- **Assets**: Created when user purchases marketplace assets
- **Linked**: All child NFTs connected to master membership
- **Queryable**: Single call returns complete user profile

### Unified User Experience
- **Single Identity**: One membership NFT represents entire user journey
- **Automatic**: No manual NFT minting required
- **Comprehensive**: All activities tracked and linked
- **Future-Ready**: Foundation for full account abstraction

## Verification & Monitoring

### Block Explorer Links
- **FlowScan Testnet**: `https://evm-testnet.flowscan.io`
- **Contract Verification**: Automatic during deployment
- **Transaction Monitoring**: All deployment txs logged with hashes

### Success Indicators
- ✅ All contracts deployed successfully
- ✅ Registry linked to membership contract
- ✅ V2 contracts authorized in registry
- ✅ Basic functionality test passes
- ✅ Contract addresses match expected format

## Migration Path

### From V1 to V2
1. **Deploy V2 System**: New contracts with account abstraction
2. **Data Migration**: Optional - migrate existing user data
3. **Frontend Update**: Switch to V2 contract addresses
4. **Gradual Rollout**: Support both V1 and V2 during transition
5. **Full Migration**: Deprecate V1 contracts when ready

This comprehensive guide ensures your MCP Flow Server can autonomously deploy and manage Flow Passport contracts on Flow Testnet with full account abstraction capabilities.