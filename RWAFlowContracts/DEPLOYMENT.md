# AssetMarketplace Deployment Guide

## Overview

The AssetMarketplace contract has been successfully deployed and verified on Flow Testnet. This document provides all the information needed to deploy, verify, and interact with the contract.

## Deployed Contract Information

- **Contract Address**: `0xc7403912b47Bd062E1933D40027088ACD5066deD`
- **Network**: Flow Testnet (Chain ID: 545)
- **Owner**: `0xd4af2053496Da8809BF69FF2A96E86831A8b2b62`
- **FlowScan**: https://evm-testnet.flowscan.io/address/0xc7403912b47Bd062E1933D40027088ACD5066deD
- **Status**: ✅ Verified

## Contract Features

### Asset Marketplace
- **5 predefined assets** with USD pricing
- **USD to FLOW conversion** (1 USD = 3 FLOW)
- **Ownership tracking** per user address
- **Payment routing** to contract owner
- **Event logging** for all purchases

### Asset Details
| ID | Asset Name | Price (USD) | Price (FLOW) |
|----|------------|-------------|--------------|
| 1  | Lisbon Apartment | $500 | 1,500 FLOW |
| 2  | NFT Art Fund | $300 | 900 FLOW |
| 3  | Brazil Coffee Loan | $200 | 600 FLOW |
| 4  | Green Energy Bond | $1,000 | 3,000 FLOW |
| 5  | Corporate Debt Fund | $750 | 2,250 FLOW |

## Available Scripts

### Deployment Scripts
```bash
# Deploy the AssetMarketplace contract
npm run deploy:marketplace

# Deploy the original RWAFlow token contract
npm run deploy:testnet
```

### Verification Scripts
```bash
# Verify AssetMarketplace contract
npm run verify:marketplace <CONTRACT_ADDRESS>

# Verify any contract manually
npm run verify <CONTRACT_ADDRESS>
```

### Testing Scripts
```bash
# Check contract status and data
npm run check:marketplace [CONTRACT_ADDRESS]

# Test asset purchase functionality
npm run test:purchase [CONTRACT_ADDRESS] [ASSET_ID]

# Run unit tests
npm test
```

### Compilation
```bash
# Compile all contracts
npm run compile
```

## Environment Setup

### Required Environment Variables

**RWAFlowContracts/.env**
```env
# Deployer private key (without 0x prefix)
DEPLOY_WALLET_1=your_private_key_here

# API key for contract verification
ETHERSCAN_API_KEY=your_api_key_here
```

**RWAFlowApp/.env**
```env
# USD to FLOW conversion rate
USD_TO_FLOW_RATE=3

# Deployed contract address
NEXT_PUBLIC_ASSET_MARKETPLACE_CONTRACT_ADDRESS=0xc7403912b47Bd062E1933D40027088ACD5066deD

# Flow network configuration
NEXT_PUBLIC_FLOW_TESTNET_RPC=https://testnet.evm.nodes.onflow.org
NEXT_PUBLIC_FLOW_TESTNET_CHAIN_ID=545
```

## Deployment Process

### Step 1: Prepare Environment
```bash
cd RWAFlowContracts
npm install
```

### Step 2: Configure Environment
Create `.env` file with your private key and API key.

### Step 3: Compile Contracts
```bash
npm run compile
```

### Step 4: Deploy Contract
```bash
npm run deploy:marketplace
```

The script will:
1. Deploy the contract
2. Wait for confirmations
3. Automatically verify on FlowScan
4. Display deployment summary
5. Test basic functions

### Step 5: Update Frontend
Copy the deployed contract address to `RWAFlowApp/.env`:
```env
NEXT_PUBLIC_ASSET_MARKETPLACE_CONTRACT_ADDRESS=<DEPLOYED_ADDRESS>
```

## Contract Functions

### User Functions
- `purchaseAsset(string assetId) payable` - Purchase an asset
- `hasAsset(address user, string assetId) view` - Check asset ownership
- `getUserAssets(address user) view` - Get all user assets
- `getAssetPriceInUSD(string assetId) view` - Get USD price
- `getAssetPriceInFLOW(string assetId) view` - Get FLOW price

### Owner Functions
- `updateConversionRate(uint256 newRate)` - Update USD/FLOW rate
- `addAsset(string assetId, string name, uint256 priceUSD)` - Add new asset
- `updateAssetPrice(string assetId, uint256 newPriceUSD)` - Update price
- `emergencyWithdraw()` - Emergency contract balance withdrawal

## Testing the Contract

### Check Contract Status
```bash
npm run check:marketplace
```

This will display:
- Contract information
- USD to FLOW conversion rate
- All asset prices
- User ownership status

### Test Asset Purchase
```bash
# Purchase Lisbon Apartment (Asset ID: 1)
npm run test:purchase 0xc7403912b47Bd062E1933D40027088ACD5066deD 1
```

### Manual Testing with Hardhat Console
```bash
npx hardhat console --network flowTestnet
```

```javascript
const AssetMarketplace = await hre.ethers.getContractFactory("AssetMarketplace");
const marketplace = AssetMarketplace.attach("0xc7403912b47Bd062E1933D40027088ACD5066deD");

// Check asset price
const price = await marketplace.getAssetPriceInFLOW("1");
console.log("Price:", hre.ethers.formatEther(price), "FLOW");

// Purchase asset (replace with actual price)
const tx = await marketplace.purchaseAsset("1", { value: price });
await tx.wait();
```

## Frontend Integration

The contract is fully integrated with the RWAFlow frontend:

- **Asset listing** shows real-time ownership status
- **Purchase buttons** are disabled for owned assets
- **Price display** shows both USD and FLOW amounts
- **Transaction handling** with loading states and confirmations
- **Wallet connection** required for purchases

## Security Features

- **ReentrancyGuard** prevents reentrancy attacks
- **Owner-only functions** for administrative tasks
- **Input validation** for all parameters
- **Safe payment handling** with proper error handling
- **Event logging** for transaction tracking

## Support

For issues or questions:
1. Check the contract on FlowScan
2. Review transaction logs
3. Ensure proper environment configuration
4. Verify wallet has sufficient FLOW balance

## Contract Verification

The contract is automatically verified during deployment. For manual verification:

```bash
npx hardhat verify --network flowTestnet 0xc7403912b47Bd062E1933D40027088ACD5066deD "0xd4af2053496Da8809BF69FF2A96E86831A8b2b62"
```

## Troubleshooting

### Common Issues

1. **"Insufficient FLOW sent"** - Ensure you send the exact FLOW amount required
2. **"User already owns this asset"** - Each asset can only be purchased once per address
3. **"Asset does not exist"** - Use valid asset IDs (1-5)
4. **Gas estimation failed** - Ensure sufficient FLOW balance for gas fees

### Network Issues

If you encounter RPC errors:
1. Wait a few minutes and retry
2. Check Flow Testnet status
3. Verify network configuration in `hardhat.config.js`

### Contract Interaction Issues

1. Verify contract address is correct
2. Ensure you're connected to Flow Testnet
3. Check that the contract is verified on FlowScan
4. Confirm your wallet has the required FLOW balance