const { exec } = require('child_process');

async function main() {
  // Get contract address from command line arguments
  const contractAddress = process.argv[2];
  
  if (!contractAddress || !contractAddress.startsWith('0x')) {
    console.error("Please provide the contract address as an argument");
    console.log("Usage: npm run verify <CONTRACT_ADDRESS>");
    process.exit(1);
  }

  console.log("Verifying RWAFlow contract at:", contractAddress);

  // Get the deployer address from the private key in .env
  require('dotenv').config();
  const { ethers } = require('ethers');
  const wallet = new ethers.Wallet(process.env.DEPLOY_WALLET_1);
  const deployerAddress = wallet.address;
  
  // Using Flow's official verification method
  const command = `npx hardhat verify --network flowTestnet ${contractAddress} "${deployerAddress}"`;
  
  console.log("Running verification command...");
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      if (stderr.includes("already verified") || stdout.includes("already verified") || error.message.includes("already verified")) {
        console.log("✅ Contract is already verified!");
      } else {
        console.error("❌ Verification failed:", error.message);
        console.error("stderr:", stderr);
      }
    } else {
      console.log("✅ Contract verified successfully!");
      console.log(stdout);
    }
    console.log(`🔍 View on FlowScan: https://evm-testnet.flowscan.io/address/${contractAddress}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });