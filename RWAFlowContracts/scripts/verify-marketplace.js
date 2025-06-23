const hre = require("hardhat");

async function main() {
  // Contract address from deployment
  const contractAddress = process.argv[2];
  
  if (!contractAddress) {
    console.error("Please provide the contract address as an argument");
    console.error("Usage: npm run verify:marketplace <CONTRACT_ADDRESS>");
    process.exit(1);
  }

  console.log("Verifying AssetMarketplace contract...");
  console.log("Contract Address:", contractAddress);
  
  // Get the deployer account for constructor arguments
  const [deployer] = await hre.ethers.getSigners();
  console.log("Original deployer:", deployer.address);
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [deployer.address],
      network: "flowTestnet"
    });
    
    console.log("Contract verified successfully!");
    console.log("FlowScan:", `https://evm-testnet.flowscan.io/address/${contractAddress}`);
  } catch (error) {
    console.error("Verification failed:", error.message);
    
    if (error.message.includes("Already Verified")) {
      console.log("Contract is already verified!");
      console.log("FlowScan:", `https://evm-testnet.flowscan.io/address/${contractAddress}`);
    } else {
      console.log("\nYou can also verify manually using:");
      console.log(`npx hardhat verify --network flowTestnet ${contractAddress} "${deployer.address}"`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });