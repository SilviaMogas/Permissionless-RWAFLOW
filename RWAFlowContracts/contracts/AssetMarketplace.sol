// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AssetMarketplace is Ownable, ReentrancyGuard {
    // USD to FLOW conversion rate (will be updated from frontend)
    uint256 public usdToFlowRate = 3; // 1 USD = 3 FLOW
    
    // Contract owner address (where payments are sent)
    address public constant CONTRACT_OWNER = 0xd4af2053496Da8809BF69FF2A96E86831A8b2b62;
    
    // Asset structure
    struct Asset {
        string name;
        uint256 priceUSD;
        bool exists;
    }
    
    // Mapping from asset ID to asset details
    mapping(string => Asset) public assets;
    
    // Mapping from user address to asset ID to ownership status
    mapping(address => mapping(string => bool)) public userAssets;
    
    // Mapping from user address to list of owned asset IDs
    mapping(address => string[]) public userAssetList;
    
    // Events
    event AssetPurchased(address indexed user, string indexed assetId, uint256 priceUSD, uint256 priceFLOW);
    event AssetAdded(string indexed assetId, string name, uint256 priceUSD);
    event ConversionRateUpdated(uint256 newRate);
    
    constructor(address initialOwner) Ownable(initialOwner) {
        // Initialize the 5 marketplace assets
        _addAsset("1", "Lisbon Apartment", 500);
        _addAsset("2", "NFT Art Fund", 300);
        _addAsset("3", "Brazil Coffee Loan", 200);
        _addAsset("4", "Green Energy Bond", 1000);
        _addAsset("5", "Corporate Debt Fund", 750);
    }
    
    // Internal function to add assets
    function _addAsset(string memory assetId, string memory name, uint256 priceUSD) internal {
        assets[assetId] = Asset({
            name: name,
            priceUSD: priceUSD,
            exists: true
        });
        emit AssetAdded(assetId, name, priceUSD);
    }
    
    // Function to purchase an asset
    function purchaseAsset(string memory assetId) external payable nonReentrant {
        require(assets[assetId].exists, "Asset does not exist");
        require(!userAssets[msg.sender][assetId], "User already owns this asset");
        
        uint256 priceUSD = assets[assetId].priceUSD;
        uint256 priceFLOW = priceUSD * usdToFlowRate * 1e18; // Convert to wei
        
        require(msg.value >= priceFLOW, "Insufficient FLOW sent");
        
        // Mark asset as owned by user
        userAssets[msg.sender][assetId] = true;
        userAssetList[msg.sender].push(assetId);
        
        // Send payment to contract owner
        (bool success, ) = payable(CONTRACT_OWNER).call{value: msg.value}("");
        require(success, "Payment transfer failed");
        
        emit AssetPurchased(msg.sender, assetId, priceUSD, msg.value);
    }
    
    // Function to check if user owns an asset
    function hasAsset(address user, string memory assetId) external view returns (bool) {
        return userAssets[user][assetId];
    }
    
    // Function to get user's owned assets
    function getUserAssets(address user) external view returns (string[] memory) {
        return userAssetList[user];
    }
    
    // Function to get asset price in FLOW
    function getAssetPriceInFLOW(string memory assetId) external view returns (uint256) {
        require(assets[assetId].exists, "Asset does not exist");
        return assets[assetId].priceUSD * usdToFlowRate * 1e18;
    }
    
    // Function to get asset price in USD
    function getAssetPriceInUSD(string memory assetId) external view returns (uint256) {
        require(assets[assetId].exists, "Asset does not exist");
        return assets[assetId].priceUSD;
    }
    
    // Owner function to update conversion rate
    function updateConversionRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be greater than 0");
        usdToFlowRate = newRate;
        emit ConversionRateUpdated(newRate);
    }
    
    // Owner function to add new assets
    function addAsset(string memory assetId, string memory name, uint256 priceUSD) external onlyOwner {
        require(!assets[assetId].exists, "Asset already exists");
        _addAsset(assetId, name, priceUSD);
    }
    
    // Owner function to update asset price
    function updateAssetPrice(string memory assetId, uint256 newPriceUSD) external onlyOwner {
        require(assets[assetId].exists, "Asset does not exist");
        assets[assetId].priceUSD = newPriceUSD;
    }
    
    // Function to get all asset IDs (for frontend)
    function getAllAssetIds() external pure returns (string[] memory) {
        string[] memory assetIds = new string[](5);
        assetIds[0] = "1";
        assetIds[1] = "2";
        assetIds[2] = "3";
        assetIds[3] = "4";
        assetIds[4] = "5";
        return assetIds;
    }
    
    // Emergency withdraw function (owner only)
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}