const hre = require("hardhat");

async function main() {
  // Contract address - update this after deployment
  const contractAddress = process.argv[2] || "0xc7403912b47Bd062E1933D40027088ACD5066deD";
  
  console.log("=== AssetMarketplace Contract Info ===");
  console.log("Contract Address:", contractAddress);
  console.log("Network: Flow Testnet");
  console.log("FlowScan:", `https://evm-testnet.flowscan.io/address/${contractAddress}`);
  
  try {
    // Get contract instance
    const AssetMarketplace = await hre.ethers.getContractFactory("AssetMarketplace");
    const marketplace = AssetMarketplace.attach(contractAddress);
    
    console.log("\n=== Contract Data ===");
    
    // Check USD to FLOW conversion rate
    const conversionRate = await marketplace.usdToFlowRate();
    console.log("USD to FLOW Rate:", conversionRate.toString());
    
    // Check contract owner
    const owner = await marketplace.owner();
    console.log("Contract Owner:", owner);
    
    // Check all asset prices
    console.log("\n=== Asset Prices ===");
    const assets = [
      { id: "1", name: "Lisbon Apartment" },
      { id: "2", name: "NFT Art Fund" },
      { id: "3", name: "Brazil Coffee Loan" },
      { id: "4", name: "Green Energy Bond" },
      { id: "5", name: "Corporate Debt Fund" }
    ];
    
    for (const asset of assets) {
      try {
        const priceUSD = await marketplace.getAssetPriceInUSD(asset.id);
        const priceFLOW = await marketplace.getAssetPriceInFLOW(asset.id);
        
        console.log(`${asset.name} (ID: ${asset.id}):`);
        console.log(`  - USD: $${priceUSD.toString()}`);
        console.log(`  - FLOW: ${hre.ethers.formatEther(priceFLOW)} FLOW`);
      } catch (error) {
        console.log(`${asset.name} (ID: ${asset.id}): Error - ${error.message}`);
      }
    }
    
    // Check if a specific user owns assets (example)
    const [deployer] = await hre.ethers.getSigners();
    console.log(`\n=== User Assets for ${deployer.address} ===`);
    
    try {
      const userAssets = await marketplace.getUserAssets(deployer.address);
      console.log("Owned Assets:", userAssets.length > 0 ? userAssets : "None");
      
      // Check individual asset ownership
      for (const asset of assets) {
        const hasAsset = await marketplace.hasAsset(deployer.address, asset.id);
        console.log(`${asset.name}: ${hasAsset ? "Owned" : "Not Owned"}`);
      }
    } catch (error) {
      console.log("Error checking user assets:", error.message);
    }
    
  } catch (error) {
    console.error("Error connecting to contract:", error.message);
    console.log("\nMake sure:");
    console.log("1. The contract address is correct");
    console.log("2. The contract is deployed on Flow Testnet");
    console.log("3. Your .env file has the correct DEPLOY_WALLET_1 private key");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });