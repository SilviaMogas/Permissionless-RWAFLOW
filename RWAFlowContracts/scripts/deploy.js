const hre = require("hardhat");

async function main() {
  console.log("Deploying RWAFlow token to Flow testnet...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "FLOW");

  // Deploy the contract
  const RWAFlow = await hre.ethers.getContractFactory("RWAFlow");
  const rwaFlow = await RWAFlow.deploy(deployer.address);

  await rwaFlow.waitForDeployment();

  const contractAddress = await rwaFlow.getAddress();
  console.log("RWAFlow deployed to:", contractAddress);

  // Get token details
  const name = await rwaFlow.name();
  const symbol = await rwaFlow.symbol();
  const totalSupply = await rwaFlow.totalSupply();
  const ownerBalance = await rwaFlow.balanceOf(deployer.address);

  console.log("\nToken Details:");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Total Supply:", hre.ethers.formatEther(totalSupply));
  console.log("Owner Balance:", hre.ethers.formatEther(ownerBalance));

  // Save deployment info
  console.log("\nDeployment Summary:");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer Address:", deployer.address);
  console.log("Network:", hre.network.name);
  console.log("Block Explorer URL:", `https://evm-testnet.flowscan.io/address/${contractAddress}`);

  // Auto-verify contract using Flow's method
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔄 Verifying contract...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [deployer.address],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      if (error.message.toLowerCase().includes("already verified")) {
        console.log("✅ Contract is already verified!");
      } else {
        console.error("❌ Verification failed:", error.message);
        console.log("You can manually verify later using:");
        console.log(`npm run verify ${contractAddress}`);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });