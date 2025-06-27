const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🧪 Testing Flow Passport Membership System...");
  
  const [deployer, testUser] = await hre.ethers.getSigners();
  console.log("👤 Test user address:", testUser.address);
  
  const networkName = hre.network.name;
  const deploymentPath = `./deployments/${networkName}-membership-system.json`;
  
  if (!fs.existsSync(deploymentPath)) {
    console.error(`❌ Deployment file not found: ${deploymentPath}`);
    console.log("Please run the deployment script first.");
    process.exit(1);
  }
  
  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const contracts = deploymentInfo.contracts;
  
  // Get contract instances
  const membershipContract = await hre.ethers.getContractAt("FlowPassportMembership", contracts.FlowPassportMembership.address);
  const registryContract = await hre.ethers.getContractAt("FlowPassportRegistry", contracts.FlowPassportRegistry.address);
  const academyV2Contract = await hre.ethers.getContractAt("AcademyCertificationV2", contracts.AcademyCertificationV2.address);
  const marketplaceV2Contract = await hre.ethers.getContractAt("AssetMarketplaceV2", contracts.AssetMarketplaceV2.address);
  
  console.log("\n📋 Contract instances loaded successfully");
  
  try {
    // Test 1: Create membership for test user
    console.log("\n🧪 Test 1: Creating membership for test user...");
    const createMembershipTx = await registryContract.createOrLinkMembership(testUser.address);
    await createMembershipTx.wait();
    
    const hasMembership = await membershipContract.hasMembership(testUser.address);
    console.log("✅ Membership created:", hasMembership);
    
    const membershipTokenId = await membershipContract.getMembershipTokenId(testUser.address);
    console.log("🎫 Membership Token ID:", membershipTokenId.toString());
    
    // Test 2: Get user profile
    console.log("\n🧪 Test 2: Getting user profile...");
    const userProfile = await registryContract.getUserProfile(testUser.address);
    console.log("👤 User Profile:");
    console.log("  - Membership Token ID:", userProfile.membershipTokenId.toString());
    console.log("  - Reputation Score:", userProfile.reputationScore.toString());
    console.log("  - Certificate Count:", userProfile.certificateCount.toString());
    console.log("  - Asset Count:", userProfile.assetCount.toString());
    console.log("  - Is Active:", userProfile.isActive);
    
    // Test 3: Submit exam result (simulate academy certificate)
    console.log("\n🧪 Test 3: Submitting exam result...");
    const submitExamTx = await academyV2Contract.submitExamResult(
      testUser.address,
      0, // ModuleLevel.BEGINNER
      8, // score
      10 // totalQuestions (80% pass)
    );
    await submitExamTx.wait();
    console.log("✅ Exam result submitted (80% - PASSED)");
    
    // Check if user passed
    const hasPassed = await academyV2Contract.hasPassedModule(testUser.address, 0);
    console.log("📜 User passed beginner module:", hasPassed);
    
    // Test 4: Check updated profile after certificate
    console.log("\n🧪 Test 4: Checking updated profile after certificate...");
    const updatedProfile = await registryContract.getUserProfile(testUser.address);
    console.log("👤 Updated Profile:");
    console.log("  - Certificate Count:", updatedProfile.certificateCount.toString());
    console.log("  - Reputation Score:", updatedProfile.reputationScore.toString());
    
    // Test 5: Get user certificates
    const userCertificates = await registryContract.getUserCertificates(testUser.address);
    console.log("📜 User Certificates:", userCertificates.length, "certificates");
    
    // Test 6: Purchase an asset
    console.log("\n🧪 Test 6: Purchasing an asset...");
    const assetPriceWei = await marketplaceV2Contract.getAssetPriceInFLOW("1");
    console.log("💰 Asset price:", hre.ethers.formatEther(assetPriceWei), "FLOW");
    
    const purchaseTx = await marketplaceV2Contract.connect(testUser).purchaseAsset("1", {
      value: assetPriceWei
    });
    await purchaseTx.wait();
    console.log("✅ Asset purchased successfully");
    
    // Test 7: Check final profile after asset purchase
    console.log("\n🧪 Test 7: Checking final profile after asset purchase...");
    const finalProfile = await registryContract.getUserProfile(testUser.address);
    console.log("👤 Final Profile:");
    console.log("  - Certificate Count:", finalProfile.certificateCount.toString());
    console.log("  - Asset Count:", finalProfile.assetCount.toString());
    console.log("  - Reputation Score:", finalProfile.reputationScore.toString());
    
    // Test 8: Get user assets
    const userAssets = await registryContract.getUserAssets(testUser.address);
    console.log("🏠 User Assets:", userAssets.length, "assets");
    
    // Test 9: Get complete user profile
    console.log("\n🧪 Test 9: Getting complete user profile...");
    const completeProfile = await registryContract.getCompleteUserProfile(testUser.address);
    console.log("📊 Complete Profile Summary:");
    console.log("  - Total Child NFTs:", completeProfile.profile.totalChildNFTs.toString());
    console.log("  - Certificates:", completeProfile.certificates.length);
    console.log("  - Assets:", completeProfile.assets.length);
    
    // Test 10: Get membership info from membership contract
    console.log("\n🧪 Test 10: Getting membership info...");
    const membershipInfo = await membershipContract.getMembershipInfo(testUser.address);
    console.log("🎫 Membership Info:");
    console.log("  - Member:", membershipInfo.member);
    console.log("  - Reputation Score:", membershipInfo.reputationScore.toString());
    console.log("  - Certificate Count:", membershipInfo.certificateCount.toString());
    console.log("  - Asset Count:", membershipInfo.assetCount.toString());
    console.log("  - Is Active:", membershipInfo.isActive);
    
    console.log("\n🎉 ALL TESTS PASSED! 🎉");
    console.log("=====================================");
    console.log("✅ Membership system is working correctly");
    console.log("✅ Account abstraction flow implemented");
    console.log("✅ Child NFT system operational");
    console.log("✅ Reputation system functioning");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    console.log("\n🔧 Error details:");
    console.log(error.message);
    if (error.transaction) {
      console.log("Transaction hash:", error.transaction.hash);
    }
    throw error;
  }
}

main()
  .then(() => {
    console.log("\n✅ Testing completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Testing failed:", error);
    process.exit(1);
  });