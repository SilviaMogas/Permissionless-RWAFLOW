const hre = require("hardhat");

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log("❌ Usage: npm run verify:academy <CERTIFICATION_ADDRESS> <NFT_ADDRESS>");
    console.log("📝 Example: npm run verify:academy 0x123... 0x456...");
    process.exit(1);
  }

  const certificationAddress = args[0];
  const nftAddress = args[1];
  
  console.log("🔍 Verifying Flow Passport Academy contracts...\n");
  console.log("📋 Verification Details:");
  console.log("├─ Network:", hre.network.name);
  console.log("├─ AcademyCertification:", certificationAddress);
  console.log("└─ AcademyNFT:", nftAddress);

  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  try {
    console.log("\n🔄 Verifying AcademyCertification contract...");
    await hre.run("verify:verify", {
      address: certificationAddress,
      constructorArguments: [deployerAddress],
    });
    console.log("✅ AcademyCertification verified successfully!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ AcademyCertification already verified!");
    } else {
      console.log("❌ AcademyCertification verification failed:", error.message);
    }
  }

  try {
    console.log("\n🔄 Verifying AcademyNFT contract...");
    await hre.run("verify:verify", {
      address: nftAddress,
      constructorArguments: [deployerAddress, certificationAddress],
    });
    console.log("✅ AcademyNFT verified successfully!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ AcademyNFT already verified!");
    } else {
      console.log("❌ AcademyNFT verification failed:", error.message);
    }
  }

  console.log("\n🔗 Block Explorer Links:");
  if (hre.network.name === "flowTestnet") {
    console.log("├─ AcademyCertification: https://evm-testnet.flowscan.io/address/" + certificationAddress);
    console.log("└─ AcademyNFT: https://evm-testnet.flowscan.io/address/" + nftAddress);
  } else if (hre.network.name === "flow") {
    console.log("├─ AcademyCertification: https://evm.flowscan.io/address/" + certificationAddress);
    console.log("└─ AcademyNFT: https://evm.flowscan.io/address/" + nftAddress);
  }

  console.log("\n✅ Verification process completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  });