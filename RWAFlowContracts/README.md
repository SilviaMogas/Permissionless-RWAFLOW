# RWAFlow Smart Contracts

RWAFlow is an ERC20 token designed for awarding points to users on the platform. This repository contains the smart contracts and deployment scripts for the Flow EVM network.

## Token Details

- **Name**: RWAFlow
- **Symbol**: RWAF
- **Decimals**: 18
- **Max Supply**: 1,000,000,000 tokens (1 billion)
- **Initial Supply**: 100,000,000 tokens (100 million)

## Features

- Standard ERC20 functionality
- Burnable tokens
- Owner-controlled minting with max supply cap
- Platform-specific `awardPoints()` function for user rewards
- Deployed on Flow EVM networks

## Smart Contract

### RWAFlow.sol

The main token contract with the following key functions:

- `mint(address to, uint256 amount)`: Mint tokens to a specific address (owner only)
- `awardPoints(address user, uint256 points)`: Award points to users (owner only)
- `burn(uint256 amount)`: Burn tokens from caller's balance
- Standard ERC20 functions (transfer, approve, etc.)

## Setup

### Prerequisites

- Node.js (v18+ recommended, though v23 works with warnings)
- npm or yarn
- Private key for deployment wallet

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Flow Network Configuration
DEPLOY_WALLET_1=your_private_key_here

# Optional: Etherscan API key (any string works for Flow)
ETHERSCAN_API_KEY=any_string_here
```

## Network Configuration

The project is configured for Flow EVM networks:

### Flow Testnet
- Chain ID: 545
- RPC URL: https://testnet.evm.nodes.onflow.org
- Block Explorer: https://evm-testnet.flowscan.io

### Flow Mainnet
- Chain ID: 747
- RPC URL: https://mainnet.evm.nodes.onflow.org
- Block Explorer: https://evm.flowscan.io

## Usage

### Compile Contracts

```bash
npm run compile
```

### Deploy to Flow Testnet

```bash
npm run deploy:testnet
```

This command will:
1. Deploy the RWAFlow contract
2. Display deployment details
3. Automatically verify the contract on FlowScan

### Manual Verification

If automatic verification fails, you can manually verify:

```bash
npm run verify <CONTRACT_ADDRESS>
```

### Run Tests

```bash
npm test
```

## Deployment Information

### Current Deployment (Testnet)

- **Contract Address**: `0x6fBD4A26B44046716e37cD93Db5c47832E276AeB`
- **Network**: Flow Testnet
- **Deployer**: `0xd4af2053496Da8809BF69FF2A96E86831A8b2b62`
- **FlowScan**: https://evm-testnet.flowscan.io/address/0x6fBD4A26B44046716e37cD93Db5c47832E276AeB

## Scripts

- `npm run compile` - Compile smart contracts
- `npm run deploy:testnet` - Deploy to Flow testnet with auto-verification
- `npm run verify <address>` - Verify contract manually
- `npm test` - Run contract tests

## Project Structure

```
RWAFlowContracts/
├── contracts/
│   └── RWAFlow.sol          # Main token contract
├── scripts/
│   ├── deploy.js            # Deployment script with auto-verification
│   └── verify.js            # Manual verification script
├── test/                    # Test files
├── hardhat.config.js        # Hardhat configuration with Flow networks
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Key Dependencies

- **Hardhat**: Development environment
- **OpenZeppelin Contracts**: Secure smart contract library
- **Hardhat Toolbox**: Essential Hardhat plugins
- **dotenv**: Environment variable management

## Flow EVM Integration

This project follows Flow's official EVM documentation and includes:

- Proper network configuration for Flow chains
- FlowScan integration for contract verification
- Flow-specific verification endpoints
- Optimized gas settings for Flow EVM

## Security Considerations

- Owner-controlled minting with max supply protection
- Standard OpenZeppelin implementations
- Proper access control mechanisms
- No upgradeability (immutable contract)

## License

ISC

## Support

For issues related to Flow EVM deployment or verification, refer to:
- [Flow EVM Documentation](https://developers.flow.com/evm/quickstart)
- [FlowScan Block Explorer](https://evm-testnet.flowscan.io)