const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🔍 Starting verification of Flow Passport Membership System...");
  
  const networkName = hre.network.name;
  const deploymentPath = `./deployments/${networkName}-membership-system.json`;
  
  if (!fs.existsSync(deploymentPath)) {
    console.error(`❌ Deployment file not found: ${deploymentPath}`);
    console.log("Please run the deployment script first.");
    process.exit(1);
  }
  
  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  console.log(`📖 Loading deployment info from ${deploymentPath}`);
  
  const contracts = deploymentInfo.contracts;
  
  try {
    // Verify FlowPassportMembership
    console.log("\n🔍 Verifying FlowPassportMembership...");
    await hre.run("verify:verify", {
      address: contracts.FlowPassportMembership.address,
      constructorArguments: contracts.FlowPassportMembership.constructorArgs,
    });
    console.log("✅ FlowPassportMembership verified");
    
    // Wait a bit between verifications to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verify FlowPassportRegistry
    console.log("\n🔍 Verifying FlowPassportRegistry...");
    await hre.run("verify:verify", {
      address: contracts.FlowPassportRegistry.address,
      constructorArguments: contracts.FlowPassportRegistry.constructorArgs,
    });
    console.log("✅ FlowPassportRegistry verified");
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verify AcademyCertificationV2
    console.log("\n🔍 Verifying AcademyCertificationV2...");
    await hre.run("verify:verify", {
      address: contracts.AcademyCertificationV2.address,
      constructorArguments: contracts.AcademyCertificationV2.constructorArgs,
    });
    console.log("✅ AcademyCertificationV2 verified");
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verify AssetMarketplaceV2
    console.log("\n🔍 Verifying AssetMarketplaceV2...");
    await hre.run("verify:verify", {
      address: contracts.AssetMarketplaceV2.address,
      constructorArguments: contracts.AssetMarketplaceV2.constructorArgs,
    });
    console.log("✅ AssetMarketplaceV2 verified");
    
    console.log("\n🎉 ALL CONTRACTS VERIFIED! 🎉");
    console.log("=====================================");
    console.log("🔗 Contract Links (FlowScan):");
    console.log(`- FlowPassportMembership: https://evm-testnet.flowscan.io/address/${contracts.FlowPassportMembership.address}`);
    console.log(`- FlowPassportRegistry: https://evm-testnet.flowscan.io/address/${contracts.FlowPassportRegistry.address}`);
    console.log(`- AcademyCertificationV2: https://evm-testnet.flowscan.io/address/${contracts.AcademyCertificationV2.address}`);
    console.log(`- AssetMarketplaceV2: https://evm-testnet.flowscan.io/address/${contracts.AssetMarketplaceV2.address}`);
    
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  Some contracts may already be verified. This is normal.");
    } else {
      console.log("\n🔧 Troubleshooting tips:");
      console.log("1. Make sure you have set ETHERSCAN_API_KEY in your .env file");
      console.log("2. Check that the contract addresses are correct");
      console.log("3. Ensure the network configuration matches your deployment");
      console.log("4. Try verifying individual contracts manually");
    }
  }
}

main()
  .then(() => {
    console.log("\n✅ Verification process completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Verification script failed:", error);
    process.exit(1);
  });