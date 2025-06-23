const hre = require("hardhat");

async function main() {
  console.log("Deploying AssetMarketplace to Flow Testnet...");
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Deploy the contract
  const AssetMarketplace = await hre.ethers.getContractFactory("AssetMarketplace");
  const assetMarketplace = await AssetMarketplace.deploy(deployer.address);
  
  await assetMarketplace.waitForDeployment();
  const contractAddress = await assetMarketplace.getAddress();
  
  console.log("AssetMarketplace deployed to:", contractAddress);
  console.log("Transaction hash:", assetMarketplace.deploymentTransaction().hash);
  
  // Wait for a few block confirmations before verification
  console.log("Waiting for block confirmations...");
  await assetMarketplace.deploymentTransaction().wait(5);
  
  // Verify the contract
  console.log("Verifying contract on FlowScan...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [deployer.address],
      network: "flowTestnet"
    });
    console.log("Contract verified successfully!");
  } catch (error) {
    console.log("Verification failed:", error.message);
    console.log("You can manually verify using:");
    console.log(`npx hardhat verify --network flowTestnet ${contractAddress} "${deployer.address}"`);
  }
  
  // Display deployment summary
  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("Contract: AssetMarketplace");
  console.log("Address:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("Network: Flow Testnet");
  console.log("FlowScan:", `https://evm-testnet.flowscan.io/address/${contractAddress}`);
  console.log("\nUpdate your .env file with:");
  console.log(`NEXT_PUBLIC_ASSET_MARKETPLACE_CONTRACT_ADDRESS=${contractAddress}`);
  
  // Test some basic functions
  console.log("\n=== TESTING CONTRACT FUNCTIONS ===");
  try {
    const asset1Price = await assetMarketplace.getAssetPriceInUSD("1");
    console.log("Lisbon Apartment price (USD):", asset1Price.toString());
    
    const asset1PriceFLOW = await assetMarketplace.getAssetPriceInFLOW("1");
    console.log("Lisbon Apartment price (FLOW):", hre.ethers.formatEther(asset1PriceFLOW));
    
    const conversionRate = await assetMarketplace.usdToFlowRate();
    console.log("USD to FLOW rate:", conversionRate.toString());
  } catch (error) {
    console.log("Error testing functions:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });