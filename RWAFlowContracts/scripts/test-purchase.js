const hre = require("hardhat");

async function main() {
  // Contract address
  const contractAddress = process.argv[2] || "0xc7403912b47Bd062E1933D40027088ACD5066deD";
  const assetId = process.argv[3] || "1"; // Default to Lisbon Apartment
  
  console.log("=== Testing Asset Purchase ===");
  console.log("Contract Address:", contractAddress);
  console.log("Asset ID:", assetId);
  
  try {
    // Get contract instance
    const AssetMarketplace = await hre.ethers.getContractFactory("AssetMarketplace");
    const marketplace = AssetMarketplace.attach(contractAddress);
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("Buyer Address:", deployer.address);
    
    // Check if user already owns the asset
    const alreadyOwned = await marketplace.hasAsset(deployer.address, assetId);
    if (alreadyOwned) {
      console.log("❌ User already owns this asset!");
      return;
    }
    
    // Get asset price
    const priceUSD = await marketplace.getAssetPriceInUSD(assetId);
    const priceFLOW = await marketplace.getAssetPriceInFLOW(assetId);
    
    console.log("Asset Price (USD):", priceUSD.toString());
    console.log("Asset Price (FLOW):", hre.ethers.formatEther(priceFLOW));
    
    // Check deployer's balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Buyer Balance:", hre.ethers.formatEther(balance), "FLOW");
    
    if (balance < priceFLOW) {
      console.log("❌ Insufficient balance for purchase!");
      return;
    }
    
    console.log("\n🔄 Initiating purchase...");
    
    // Purchase the asset
    const tx = await marketplace.purchaseAsset(assetId, {
      value: priceFLOW,
      gasLimit: 300000 // Set explicit gas limit
    });
    
    console.log("Transaction sent:", tx.hash);
    console.log("Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed!");
    console.log("Gas used:", receipt.gasUsed.toString());
    
    // Verify ownership
    const nowOwned = await marketplace.hasAsset(deployer.address, assetId);
    console.log("Asset now owned:", nowOwned);
    
    // Get updated user assets
    const userAssets = await marketplace.getUserAssets(deployer.address);
    console.log("All owned assets:", userAssets);
    
    console.log("\n🎉 Purchase successful!");
    console.log("FlowScan:", `https://evm-testnet.flowscan.io/tx/${tx.hash}`);
    
  } catch (error) {
    console.error("❌ Purchase failed:", error.message);
    
    if (error.message.includes("User already owns this asset")) {
      console.log("User already owns this asset");
    } else if (error.message.includes("Insufficient FLOW sent")) {
      console.log("Insufficient FLOW sent for purchase");
    } else if (error.message.includes("Asset does not exist")) {
      console.log("Asset ID does not exist");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });