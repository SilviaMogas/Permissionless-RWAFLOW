const hre = require("hardhat");
const fs = require('fs');

// Helper function to retry deployment with exponential backoff
async function deployWithRetry(contractFactory, args, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const contract = await contractFactory.deploy(...args);
      await contract.waitForDeployment();
      return contract;
    } catch (error) {
      console.log(`Deployment attempt ${i + 1} failed:`, error.message);
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 5000; // 5s, 10s, 20s
      console.log(`Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function main() {
  console.log("🚀 Starting deployment of Flow Passport Membership System...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Step 1: Deploy FlowPassportMembership
  console.log("\n🏗️  Deploying FlowPassportMembership...");
  const FlowPassportMembership = await hre.ethers.getContractFactory("FlowPassportMembership");
  const membershipContract = await deployWithRetry(FlowPassportMembership, [
    deployer.address, // initialOwner
    "https://flowpassport.com/api/metadata/" // baseURI
  ]);
  
  const membershipAddress = await membershipContract.getAddress();
  console.log("✅ FlowPassportMembership deployed to:", membershipAddress);

  // Step 2: Deploy FlowPassportRegistry
  console.log("\n🏗️  Deploying FlowPassportRegistry...");
  const FlowPassportRegistry = await hre.ethers.getContractFactory("FlowPassportRegistry");
  const registryContract = await deployWithRetry(FlowPassportRegistry, [
    deployer.address, // initialOwner
    membershipAddress // membership contract address
  ]);
  
  const registryAddress = await registryContract.getAddress();
  console.log("✅ FlowPassportRegistry deployed to:", registryAddress);

  // Step 3: Set registry contract in membership contract
  console.log("\n🔗 Linking contracts...");
  const setRegistryTx = await membershipContract.setRegistryContract(registryAddress);
  await setRegistryTx.wait();
  console.log("✅ Registry contract linked to membership contract");

  // Step 4: Deploy AcademyCertificationV2
  console.log("\n🏗️  Deploying AcademyCertificationV2...");
  const AcademyCertificationV2 = await hre.ethers.getContractFactory("AcademyCertificationV2");
  const academyV2Contract = await deployWithRetry(AcademyCertificationV2, [
    deployer.address, // initialOwner
    registryAddress // registry contract address
  ]);
  
  const academyV2Address = await academyV2Contract.getAddress();
  console.log("✅ AcademyCertificationV2 deployed to:", academyV2Address);

  // Step 5: Deploy AssetMarketplaceV2
  console.log("\n🏗️  Deploying AssetMarketplaceV2...");
  const AssetMarketplaceV2 = await hre.ethers.getContractFactory("AssetMarketplaceV2");
  const marketplaceV2Contract = await deployWithRetry(AssetMarketplaceV2, [
    deployer.address, // initialOwner
    registryAddress // registry contract address
  ]);
  
  const marketplaceV2Address = await marketplaceV2Contract.getAddress();
  console.log("✅ AssetMarketplaceV2 deployed to:", marketplaceV2Address);

  // Step 6: Authorize contracts in registry
  console.log("\n🔐 Authorizing contracts...");
  
  const authAcademyTx = await registryContract.authorizeContract(academyV2Address, true);
  await authAcademyTx.wait();
  console.log("✅ AcademyCertificationV2 authorized in registry");
  
  const authMarketplaceTx = await registryContract.authorizeContract(marketplaceV2Address, true);
  await authMarketplaceTx.wait();
  console.log("✅ AssetMarketplaceV2 authorized in registry");

  // Step 7: Save deployment information
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      FlowPassportMembership: {
        address: membershipAddress,
        constructorArgs: [deployer.address, "https://flowpassport.com/api/metadata/"]
      },
      FlowPassportRegistry: {
        address: registryAddress,
        constructorArgs: [deployer.address, membershipAddress]
      },
      AcademyCertificationV2: {
        address: academyV2Address,
        constructorArgs: [deployer.address, registryAddress]
      },
      AssetMarketplaceV2: {
        address: marketplaceV2Address,
        constructorArgs: [deployer.address, registryAddress]
      }
    }
  };

  const deploymentPath = `./deployments/${hre.network.name}-membership-system.json`;
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Deployment info saved to ${deploymentPath}`);

  // Summary
  console.log("\n🎉 DEPLOYMENT COMPLETE! 🎉");
  console.log("=====================================");
  console.log("📋 Contract Addresses:");
  console.log("- FlowPassportMembership:", membershipAddress);
  console.log("- FlowPassportRegistry:", registryAddress);
  console.log("- AcademyCertificationV2:", academyV2Address);
  console.log("- AssetMarketplaceV2:", marketplaceV2Address);
  console.log("\n🔍 Next steps:");
  console.log("1. Verify contracts on FlowScan");
  console.log("2. Update frontend environment variables");
  console.log("3. Test the system integration");
  
  // Return addresses for verification
  return {
    membershipAddress,
    registryAddress,
    academyV2Address,
    marketplaceV2Address
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then((addresses) => {
    console.log("\n✅ All contracts deployed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });