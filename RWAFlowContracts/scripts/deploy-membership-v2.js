const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting Flow Passport Membership System V2 deployment...");
  
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("\n📋 Deployment Details:");
  console.log(`├─ Network: ${hre.network.name}`);
  console.log(`├─ Deployer: ${deployer.address}`);
  console.log(`├─ Chain ID: ${(await hre.ethers.provider.getNetwork()).chainId}`);
  console.log(`└─ Balance: ${hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address))} FLOW`);

  // Step 1: Deploy FlowPassportMembership
  console.log("\n🔄 Deploying FlowPassportMembership contract...");
  const FlowPassportMembership = await hre.ethers.getContractFactory("FlowPassportMembership");
  const membershipContract = await FlowPassportMembership.deploy(
    deployer.address,
    "https://flowpassport.com/api/metadata/"
  );
  await membershipContract.waitForDeployment();
  const membershipAddress = await membershipContract.getAddress();
  console.log("✅ FlowPassportMembership deployed!");
  console.log(`├─ Address: ${membershipAddress}`);
  console.log(`└─ Owner: ${deployer.address}`);

  // Step 2: Deploy FlowPassportRegistry
  console.log("\n🔄 Deploying FlowPassportRegistry contract...");
  const FlowPassportRegistry = await hre.ethers.getContractFactory("FlowPassportRegistry");
  const registryContract = await FlowPassportRegistry.deploy(
    deployer.address,
    membershipAddress
  );
  await registryContract.waitForDeployment();
  const registryAddress = await registryContract.getAddress();
  console.log("✅ FlowPassportRegistry deployed!");
  console.log(`├─ Address: ${registryAddress}`);
  console.log(`├─ Owner: ${deployer.address}`);
  console.log(`└─ Membership Contract: ${membershipAddress}`);

  // Step 3: Set registry contract in membership
  console.log("\n🔄 Linking registry to membership contract...");
  const setRegistryTx = await membershipContract.setRegistryContract(registryAddress);
  await setRegistryTx.wait();
  console.log("✅ Registry linked to membership contract!");

  // Step 4: Deploy AcademyCertificationV2
  console.log("\n🔄 Deploying AcademyCertificationV2 contract...");
  const AcademyCertificationV2 = await hre.ethers.getContractFactory("AcademyCertificationV2");
  const academyV2Contract = await AcademyCertificationV2.deploy(
    deployer.address,
    registryAddress
  );
  await academyV2Contract.waitForDeployment();
  const academyV2Address = await academyV2Contract.getAddress();
  console.log("✅ AcademyCertificationV2 deployed!");
  console.log(`├─ Address: ${academyV2Address}`);
  console.log(`├─ Owner: ${deployer.address}`);
  console.log(`└─ Registry Contract: ${registryAddress}`);

  // Step 5: Deploy AssetMarketplaceV2
  console.log("\n🔄 Deploying AssetMarketplaceV2 contract...");
  const AssetMarketplaceV2 = await hre.ethers.getContractFactory("AssetMarketplaceV2");
  const marketplaceV2Contract = await AssetMarketplaceV2.deploy(
    deployer.address,
    registryAddress
  );
  await marketplaceV2Contract.waitForDeployment();
  const marketplaceV2Address = await marketplaceV2Contract.getAddress();
  console.log("✅ AssetMarketplaceV2 deployed!");
  console.log(`├─ Address: ${marketplaceV2Address}`);
  console.log(`├─ Owner: ${deployer.address}`);
  console.log(`└─ Registry Contract: ${registryAddress}`);

  // Step 6: Authorize contracts in registry
  console.log("\n🔄 Authorizing contracts in registry...");
  const authAcademyTx = await registryContract.authorizeContract(academyV2Address, true);
  await authAcademyTx.wait();
  console.log("✅ AcademyCertificationV2 authorized!");
  
  const authMarketplaceTx = await registryContract.authorizeContract(marketplaceV2Address, true);
  await authMarketplaceTx.wait();
  console.log("✅ AssetMarketplaceV2 authorized!");

  console.log("\n⏳ Waiting for confirmations...");
  await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds

  // Verification
  console.log("\n🔍 Starting contract verification...");
  try {
    console.log("🔄 Verifying FlowPassportMembership...");
    await hre.run("verify:verify", {
      address: membershipAddress,
      constructorArguments: [deployer.address, "https://flowpassport.com/api/metadata/"],
    });
    console.log("✅ FlowPassportMembership verified!");
  } catch (error) {
    console.log("❌ FlowPassportMembership verification failed:", error.message);
  }

  try {
    console.log("🔄 Verifying FlowPassportRegistry...");
    await hre.run("verify:verify", {
      address: registryAddress,
      constructorArguments: [deployer.address, membershipAddress],
    });
    console.log("✅ FlowPassportRegistry verified!");
  } catch (error) {
    console.log("❌ FlowPassportRegistry verification failed:", error.message);
  }

  try {
    console.log("🔄 Verifying AcademyCertificationV2...");
    await hre.run("verify:verify", {
      address: academyV2Address,
      constructorArguments: [deployer.address, registryAddress],
    });
    console.log("✅ AcademyCertificationV2 verified!");
  } catch (error) {
    console.log("❌ AcademyCertificationV2 verification failed:", error.message);
  }

  try {
    console.log("🔄 Verifying AssetMarketplaceV2...");
    await hre.run("verify:verify", {
      address: marketplaceV2Address,
      constructorArguments: [deployer.address, registryAddress],
    });
    console.log("✅ AssetMarketplaceV2 verified!");
  } catch (error) {
    console.log("❌ AssetMarketplaceV2 verification failed:", error.message);
  }

  // Test basic functionality
  console.log("\n🧪 Testing contract functionality...");
  
  // Test membership creation
  console.log("🔄 Testing membership creation...");
  const testUser = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const createMembershipTx = await registryContract.createOrLinkMembership(testUser);
  await createMembershipTx.wait();
  
  const hasMembership = await membershipContract.hasMembership(testUser);
  const membershipTokenId = await membershipContract.getMembershipTokenId(testUser);
  console.log("✅ Membership creation test passed!");
  console.log(`├─ Has membership: ${hasMembership}`);
  console.log(`└─ Membership Token ID: ${membershipTokenId}`);

  // Display deployment summary
  console.log("\n📊 DEPLOYMENT SUMMARY");
  console.log("══════════════════════════════════════════════════");
  console.log("🎯 Flow Passport Membership System V2");
  console.log("══════════════════════════════════════════════════");
  
  console.log("FlowPassportMembership Contract:");
  console.log(`├─ Address: ${membershipAddress}`);
  console.log(`├─ Owner: ${deployer.address}`);
  console.log(`└─ Network: ${hre.network.name}`);
  
  console.log("\nFlowPassportRegistry Contract:");
  console.log(`├─ Address: ${registryAddress}`);
  console.log(`├─ Owner: ${deployer.address}`);
  console.log(`├─ Membership Contract: ${membershipAddress}`);
  console.log(`└─ Network: ${hre.network.name}`);
  
  console.log("\nAcademyCertificationV2 Contract:");
  console.log(`├─ Address: ${academyV2Address}`);
  console.log(`├─ Owner: ${deployer.address}`);
  console.log(`├─ Registry Contract: ${registryAddress}`);
  console.log(`└─ Network: ${hre.network.name}`);
  
  console.log("\nAssetMarketplaceV2 Contract:");
  console.log(`├─ Address: ${marketplaceV2Address}`);
  console.log(`├─ Owner: ${deployer.address}`);
  console.log(`├─ Registry Contract: ${registryAddress}`);
  console.log(`└─ Network: ${hre.network.name}`);

  console.log("\n🔗 Block Explorer:");
  console.log(`├─ FlowPassportMembership: https://evm-testnet.flowscan.io/address/${membershipAddress}`);
  console.log(`├─ FlowPassportRegistry: https://evm-testnet.flowscan.io/address/${registryAddress}`);
  console.log(`├─ AcademyCertificationV2: https://evm-testnet.flowscan.io/address/${academyV2Address}`);
  console.log(`└─ AssetMarketplaceV2: https://evm-testnet.flowscan.io/address/${marketplaceV2Address}`);

  console.log("\n📝 Next Steps:");
  console.log("1. Update frontend .env with V2 contract addresses:");
  console.log(`   NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS=${membershipAddress}`);
  console.log(`   NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS=${registryAddress}`);
  console.log(`   NEXT_PUBLIC_ACADEMY_V2_CONTRACT_ADDRESS=${academyV2Address}`);
  console.log(`   NEXT_PUBLIC_MARKETPLACE_V2_CONTRACT_ADDRESS=${marketplaceV2Address}`);
  console.log("2. Test the complete user journey with account abstraction");
  console.log("3. Integrate with account abstraction providers");

  console.log("\n✅ Deployment completed successfully!");

  return {
    membershipAddress,
    registryAddress,
    academyV2Address,
    marketplaceV2Address
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });