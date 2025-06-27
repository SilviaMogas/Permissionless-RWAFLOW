#!/bin/bash

# MCP Flow Server - Flow Testnet Deployment Commands
# This script provides all necessary commands for automated deployment

set -e  # Exit on any error

echo "🚀 Flow Passport - Flow Testnet Deployment Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js version
    NODE_VERSION=$(node --version)
    print_status "Node.js version: $NODE_VERSION"
    
    if [[ $NODE_VERSION == *"v23"* ]]; then
        print_warning "Node.js v23.x detected. Hardhat recommends v18.x or v20.x"
    fi
    
    # Check if we're in the right directory
    if [ ! -f "hardhat.config.js" ]; then
        print_error "hardhat.config.js not found. Please run from RWAFlowContracts directory"
        exit 1
    fi
    
    # Check environment variables
    if [ -z "$DEPLOY_WALLET_1" ]; then
        print_error "DEPLOY_WALLET_1 environment variable not set"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Compile contracts
compile_contracts() {
    print_status "Compiling contracts..."
    npm run compile
    print_success "Contracts compiled successfully"
}

# Deploy V2 Account Abstraction System
deploy_v2_system() {
    print_status "Deploying V2 Account Abstraction System..."
    
    npx hardhat run scripts/deploy-membership-v2.js --network flowTestnet
    
    if [ $? -eq 0 ]; then
        print_success "V2 system deployed successfully"
    else
        print_error "V2 system deployment failed"
        exit 1
    fi
}

# Deploy V1 Legacy System (optional)
deploy_v1_system() {
    print_status "Deploying V1 Legacy System..."
    
    print_status "Deploying marketplace..."
    npx hardhat run scripts/deploy-marketplace.js --network flowTestnet
    
    print_status "Deploying academy..."
    npx hardhat run scripts/deploy-academy.js --network flowTestnet
    
    print_success "V1 system deployed"
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    if [ -f "scripts/test-membership-system.js" ]; then
        node scripts/test-membership-system.js
        print_success "Deployment tests passed"
    else
        print_warning "Test script not found, skipping tests"
    fi
}

# Verify contracts
verify_contracts() {
    print_status "Verifying contracts..."
    
    if [ -f "scripts/verify-membership-system.js" ]; then
        node scripts/verify-membership-system.js
    else
        print_warning "Verification script not found"
    fi
}

# Display deployment summary
display_summary() {
    print_success "Deployment Summary"
    echo "===================="
    echo ""
    echo "🔗 Network: Flow Testnet"
    echo "🌐 Chain ID: 545"
    echo "🔍 Explorer: https://evm-testnet.flowscan.io"
    echo ""
    echo "📋 V2 Contract Addresses:"
    echo "├─ FlowPassportMembership: 0x04788614eecB86a9eEF39928D8dafBfAe54476a8"
    echo "├─ FlowPassportRegistry: 0xdf03552Dd7afB410DE95E3c810AB7b39299904E7"
    echo "├─ AcademyCertificationV2: 0x525715A1BcC513F66Eecea513652fc294833ef6C"
    echo "└─ AssetMarketplaceV2: 0xc4951B1C022A29b4dCdbB3DE06e5C2f7A5767501"
    echo ""
    echo "📋 V1 Contract Addresses (Legacy):"
    echo "├─ AssetMarketplace: 0xc7403912b47Bd062E1933D40027088ACD5066deD"
    echo "├─ RWAFlowToken: 0x6fBD4A26B44046716e37cD93Db5c47832E276AeB"
    echo "├─ AcademyCertification: 0x66206f19Ca68C1B6286673ED3E7500AD50827df2"
    echo "└─ AcademyNFT: 0xA5AC23d9f4EDc3068081D08214aa2D8fA7de7f4B"
    echo ""
    echo "📝 Frontend Environment Variables:"
    echo "NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS=0x04788614eecB86a9eEF39928D8dafBfAe54476a8"
    echo "NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS=0xdf03552Dd7afB410DE95E3c810AB7b39299904E7"
    echo "NEXT_PUBLIC_ACADEMY_V2_CONTRACT_ADDRESS=0x525715A1BcC513F66Eecea513652fc294833ef6C"
    echo "NEXT_PUBLIC_MARKETPLACE_V2_CONTRACT_ADDRESS=0xc4951B1C022A29b4dCdbB3DE06e5C2f7A5767501"
}

# Main deployment function
main() {
    local DEPLOY_TYPE=${1:-"v2"}  # Default to V2 deployment
    
    echo "🎯 Deployment Type: $DEPLOY_TYPE"
    echo ""
    
    check_prerequisites
    install_dependencies
    compile_contracts
    
    case $DEPLOY_TYPE in
        "v2")
            deploy_v2_system
            ;;
        "v1")
            deploy_v1_system
            ;;
        "both")
            deploy_v2_system
            deploy_v1_system
            ;;
        *)
            print_error "Invalid deployment type. Use: v2, v1, or both"
            exit 1
            ;;
    esac
    
    test_deployment
    verify_contracts
    display_summary
    
    print_success "🎉 Deployment completed successfully!"
}

# Usage information
usage() {
    echo "Usage: $0 [deployment_type]"
    echo ""
    echo "Deployment types:"
    echo "  v2    - Deploy V2 Account Abstraction System (default)"
    echo "  v1    - Deploy V1 Legacy System"
    echo "  both  - Deploy both V1 and V2 systems"
    echo ""
    echo "Examples:"
    echo "  $0          # Deploy V2 system"
    echo "  $0 v2       # Deploy V2 system"
    echo "  $0 v1       # Deploy V1 system"
    echo "  $0 both     # Deploy both systems"
    echo ""
    echo "Prerequisites:"
    echo "  - Set DEPLOY_WALLET_1 environment variable"
    echo "  - Run from RWAFlowContracts directory"
    echo "  - Ensure Node.js 18.x or 20.x (avoid 23.x)"
}

# Handle script arguments
if [[ $1 == "--help" ]] || [[ $1 == "-h" ]]; then
    usage
    exit 0
fi

# Run main function with arguments
main "$@"

# Individual command functions for MCP server
deploy_membership_only() {
    print_status "Deploying FlowPassportMembership only..."
    npx hardhat run -c "
    const hre = require('hardhat');
    async function main() {
        const [deployer] = await hre.ethers.getSigners();
        const FlowPassportMembership = await hre.ethers.getContractFactory('FlowPassportMembership');
        const contract = await FlowPassportMembership.deploy(deployer.address, 'https://flowpassport.com/api/metadata/');
        await contract.waitForDeployment();
        console.log('FlowPassportMembership deployed to:', await contract.getAddress());
    }
    main().catch(console.error);
    " --network flowTestnet
}

deploy_registry_only() {
    local MEMBERSHIP_ADDRESS=$1
    print_status "Deploying FlowPassportRegistry only..."
    npx hardhat run -c "
    const hre = require('hardhat');
    async function main() {
        const [deployer] = await hre.ethers.getSigners();
        const FlowPassportRegistry = await hre.ethers.getContractFactory('FlowPassportRegistry');
        const contract = await FlowPassportRegistry.deploy(deployer.address, '$MEMBERSHIP_ADDRESS');
        await contract.waitForDeployment();
        console.log('FlowPassportRegistry deployed to:', await contract.getAddress());
    }
    main().catch(console.error);
    " --network flowTestnet
}

# Quick deployment commands for MCP server
quick_deploy_v2() {
    export DEPLOY_WALLET_1=${DEPLOY_WALLET_1}
    cd RWAFlowContracts
    npm run compile
    npx hardhat run scripts/deploy-membership-v2.js --network flowTestnet
}

quick_test() {
    cd RWAFlowContracts
    node scripts/test-membership-system.js
}

# Export functions for sourcing
export -f main deploy_v2_system deploy_v1_system quick_deploy_v2 quick_test