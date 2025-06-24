const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🎓 Starting Flow Passport Academy contracts deployment...\n");

  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  
  console.log("📋 Deployment Details:");
  console.log("├─ Network:", hre.network.name);
  console.log("├─ Deployer:", deployerAddress);
  console.log("├─ Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);
  
  const balance = await hre.ethers.provider.getBalance(deployerAddress);
  console.log("└─ Balance:", hre.ethers.formatEther(balance), "FLOW\n");

  // Deploy AcademyCertification contract first
  console.log("🔄 Deploying AcademyCertification contract...");
  const AcademyCertification = await hre.ethers.getContractFactory("AcademyCertification");
  const academyCertification = await AcademyCertification.deploy(deployerAddress);
  await academyCertification.waitForDeployment();
  const certificationAddress = await academyCertification.getAddress();
  
  console.log("✅ AcademyCertification deployed!");
  console.log("├─ Address:", certificationAddress);
  console.log("└─ Owner:", deployerAddress);

  // Deploy AcademyNFT contract
  console.log("\n🔄 Deploying AcademyNFT contract...");
  const AcademyNFT = await hre.ethers.getContractFactory("AcademyNFT");
  const academyNFT = await AcademyNFT.deploy(deployerAddress, certificationAddress);
  await academyNFT.waitForDeployment();
  const nftAddress = await academyNFT.getAddress();
  
  console.log("✅ AcademyNFT deployed!");
  console.log("├─ Address:", nftAddress);
  console.log("├─ Owner:", deployerAddress);
  console.log("└─ Certification Contract:", certificationAddress);

  // Wait for a few block confirmations
  console.log("\n⏳ Waiting for confirmations...");
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Verify contracts automatically
  console.log("\n🔍 Starting contract verification...");
  
  try {
    console.log("🔄 Verifying AcademyCertification...");
    await hre.run("verify:verify", {
      address: certificationAddress,
      constructorArguments: [deployerAddress],
    });
    console.log("✅ AcademyCertification verified!");
  } catch (error) {
    console.log("❌ AcademyCertification verification failed:", error.message);
  }

  try {
    console.log("🔄 Verifying AcademyNFT...");
    await hre.run("verify:verify", {
      address: nftAddress,
      constructorArguments: [deployerAddress, certificationAddress],
    });
    console.log("✅ AcademyNFT verified!");
  } catch (error) {
    console.log("❌ AcademyNFT verification failed:", error.message);
  }

  // Test basic functionality
  console.log("\n🧪 Testing contract functionality...");
  
  try {
    // Test AcademyCertification
    const moduleLevel = 0; // BEGINNER
    const score = 8;
    const totalQuestions = 10;
    
    console.log("🔄 Testing exam result submission...");
    const tx1 = await academyCertification.submitExamResult(deployerAddress, moduleLevel, score, totalQuestions);
    await tx1.wait();
    console.log("✅ Exam result submitted successfully!");
    
    const hasPassedTest = await academyCertification.hasPassedModule(deployerAddress, moduleLevel);
    console.log("├─ Has passed module:", hasPassedTest);
    
    const examResult = await academyCertification.getExamResult(deployerAddress, moduleLevel);
    console.log("├─ Score:", examResult.score.toString() + "/" + examResult.totalQuestions.toString());
    console.log("├─ Percentage:", ((examResult.score * 100n) / examResult.totalQuestions).toString() + "%");
    console.log("└─ Passed:", examResult.passed);

    // Test AcademyNFT
    if (hasPassedTest) {
      console.log("\n🔄 Testing NFT certificate minting...");
      const canMint = await academyNFT.canMintCertificate(deployerAddress, moduleLevel);
      console.log("├─ Can mint certificate:", canMint);
      
      if (canMint) {
        const tx2 = await academyNFT.mintCertificate(moduleLevel);
        await tx2.wait();
        console.log("✅ Certificate NFT minted successfully!");
        
        const userCertificates = await academyNFT.getUserCertificates(deployerAddress);
        console.log("└─ User certificates:", userCertificates.map(id => id.toString()));
      }
    }
    
  } catch (error) {
    console.log("❌ Contract testing failed:", error.message);
  }

  // Print deployment summary
  console.log("\n📊 DEPLOYMENT SUMMARY");
  console.log("═".repeat(50));
  console.log("🎓 Flow Passport Academy Contracts");
  console.log("═".repeat(50));
  console.log("AcademyCertification Contract:");
  console.log("├─ Address:", certificationAddress);
  console.log("├─ Owner:", deployerAddress);
  console.log("└─ Network:", hre.network.name);
  console.log("");
  console.log("AcademyNFT Contract:");
  console.log("├─ Address:", nftAddress);
  console.log("├─ Owner:", deployerAddress);
  console.log("├─ Certification Contract:", certificationAddress);
  console.log("└─ Network:", hre.network.name);
  console.log("");
  console.log("🔗 Block Explorer:");
  if (hre.network.name === "flowTestnet") {
    console.log("├─ AcademyCertification: https://evm-testnet.flowscan.io/address/" + certificationAddress);
    console.log("└─ AcademyNFT: https://evm-testnet.flowscan.io/address/" + nftAddress);
  } else if (hre.network.name === "flow") {
    console.log("├─ AcademyCertification: https://evm.flowscan.io/address/" + certificationAddress);
    console.log("└─ AcademyNFT: https://evm.flowscan.io/address/" + nftAddress);
  }
  console.log("");
  console.log("📝 Next Steps:");
  console.log("1. Update frontend .env with contract addresses:");
  console.log("   NEXT_PUBLIC_ACADEMY_CERTIFICATION_ADDRESS=" + certificationAddress);
  console.log("   NEXT_PUBLIC_ACADEMY_NFT_ADDRESS=" + nftAddress);
  console.log("2. Test the academy quiz completion flow");
  console.log("3. Test NFT certificate minting");
  console.log("");
  console.log("✅ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });