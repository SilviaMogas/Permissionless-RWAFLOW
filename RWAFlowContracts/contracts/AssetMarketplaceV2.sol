// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./FlowPassportRegistry.sol";

contract AssetMarketplaceV2 is Ownable, ReentrancyGuard {
    
    FlowPassportRegistry public registryContract;
    
    // USD to FLOW conversion rate (will be updated from frontend)
    uint256 public usdToFlowRate = 3; // 1 USD = 3 FLOW
    
    // Contract owner address (where payments are sent)
    address public constant CONTRACT_OWNER = 0xd4af2053496Da8809BF69FF2A96E86831A8b2b62;
    
    // Asset structure
    struct Asset {
        string name;
        uint256 priceUSD;
        bool exists;
        string description;
        string category;
        string metadata;
    }
    
    // Mapping from asset ID to asset details
    mapping(string => Asset) public assets;
    
    // Mapping from user address to asset ID to ownership status
    mapping(address => mapping(string => bool)) public userAssets;
    
    // Mapping from user address to list of owned asset IDs
    mapping(address => string[]) public userAssetList;
    
    // Track total purchases per asset
    mapping(string => uint256) public assetPurchaseCount;
    
    // Events
    event AssetPurchased(
        address indexed user,
        string indexed assetId,
        uint256 priceUSD,
        uint256 priceFLOW,
        uint256 membershipTokenId
    );
    
    event AssetAdded(string indexed assetId, string name, uint256 priceUSD);
    event ConversionRateUpdated(uint256 newRate);
    event RegistryUpdated(address indexed newRegistry);
    
    constructor(
        address initialOwner,
        address _registryContract
    ) Ownable(initialOwner) {
        registryContract = FlowPassportRegistry(_registryContract);
        
        // Initialize the 5 marketplace assets with enhanced metadata
        _addAsset("1", "Lisbon Apartment", 500, "Prime European real estate exposure", "Real Estate", 
                 '{"location":"Lisbon, Portugal","type":"Apartment","roi":"8.5%","risk":"Medium"}');
        _addAsset("2", "NFT Art Fund", 300, "Curated blue-chip NFT collection", "Digital Assets", 
                 '{"collection":"Blue-chip NFTs","roi":"12.3%","risk":"High"}');
        _addAsset("3", "Brazil Coffee Loan", 200, "Agricultural commodity financing", "Commodities", 
                 '{"commodity":"Coffee","location":"Brazil","roi":"6.8%","risk":"Medium-Low"}');
        _addAsset("4", "Green Energy Bond", 1000, "Sustainable energy infrastructure", "ESG Investment", 
                 '{"sector":"Renewable Energy","roi":"7.2%","risk":"Low"}');
        _addAsset("5", "Corporate Debt Fund", 750, "Diversified corporate credit exposure", "Fixed Income", 
                 '{"sector":"Corporate Bonds","roi":"5.9%","risk":"Low-Medium"}');
    }
    
    function _addAsset(
        string memory assetId, 
        string memory name, 
        uint256 priceUSD,
        string memory description,
        string memory category,
        string memory metadata
    ) internal {
        assets[assetId] = Asset({
            name: name,
            priceUSD: priceUSD,
            exists: true,
            description: description,
            category: category,
            metadata: metadata
        });
        emit AssetAdded(assetId, name, priceUSD);
    }
    
    function purchaseAsset(string memory assetId) external payable nonReentrant {
        require(assets[assetId].exists, "Asset does not exist");
        require(!userAssets[msg.sender][assetId], "User already owns this asset");
        
        uint256 priceUSD = assets[assetId].priceUSD;
        uint256 priceFLOW = priceUSD * usdToFlowRate * 1e18; // Convert to wei
        
        require(msg.value >= priceFLOW, "Insufficient FLOW sent");
        
        // Ensure user has membership (create if needed)
        uint256 membershipTokenId = registryContract.createOrLinkMembership(msg.sender);
        
        // Mark asset as owned by user
        userAssets[msg.sender][assetId] = true;
        userAssetList[msg.sender].push(assetId);
        
        // Update purchase count
        assetPurchaseCount[assetId]++;
        
        // Add asset as child NFT to user's membership
        string memory assetMetadata = _generateAssetMetadata(msg.sender, assetId, priceUSD, priceFLOW);
        
        registryContract.addChildNFT(
            msg.sender,
            address(this),
            _stringToUint(assetId), // Convert asset ID to uint for token ID
            "asset",
            assetMetadata
        );
        
        // Send payment to contract owner
        (bool success, ) = payable(CONTRACT_OWNER).call{value: msg.value}("");
        require(success, "Payment transfer failed");
        
        emit AssetPurchased(msg.sender, assetId, priceUSD, msg.value, membershipTokenId);
    }
    
    function _generateAssetMetadata(
        address user,
        string memory assetId,
        uint256 priceUSD,
        uint256 priceFLOW
    ) internal view returns (string memory) {
        Asset memory asset = assets[assetId];
        
        return string(abi.encodePacked(
            '{"user":"', _addressToString(user), '",',
            '"assetId":"', assetId, '",',
            '"assetName":"', asset.name, '",',
            '"category":"', asset.category, '",',
            '"priceUSD":', _toString(priceUSD), ',',
            '"priceFLOW":', _toString(priceFLOW), ',',
            '"purchaseTimestamp":', _toString(block.timestamp), ',',
            '"assetMetadata":', asset.metadata, '}'
        ));
    }
    
    function hasAsset(address user, string memory assetId) external view returns (bool) {
        return userAssets[user][assetId];
    }
    
    function getUserAssets(address user) external view returns (string[] memory) {
        return userAssetList[user];
    }
    
    function getAssetPriceInFLOW(string memory assetId) external view returns (uint256) {
        require(assets[assetId].exists, "Asset does not exist");
        return assets[assetId].priceUSD * usdToFlowRate * 1e18;
    }
    
    function getAssetPriceInUSD(string memory assetId) external view returns (uint256) {
        require(assets[assetId].exists, "Asset does not exist");
        return assets[assetId].priceUSD;
    }
    
    function getAllAssetIds() external pure returns (string[] memory) {
        string[] memory assetIds = new string[](5);
        assetIds[0] = "1";
        assetIds[1] = "2";
        assetIds[2] = "3";
        assetIds[3] = "4";
        assetIds[4] = "5";
        return assetIds;
    }
    
    function updateConversionRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be greater than 0");
        usdToFlowRate = newRate;
        emit ConversionRateUpdated(newRate);
    }
    
    function updateRegistryContract(address newRegistry) external onlyOwner {
        require(newRegistry != address(0), "Invalid registry address");
        registryContract = FlowPassportRegistry(newRegistry);
        emit RegistryUpdated(newRegistry);
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // Helper functions
    function _stringToUint(string memory str) internal pure returns (uint256) {
        bytes memory b = bytes(str);
        uint256 result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            if (b[i] >= 0x30 && b[i] <= 0x39) {
                result = result * 10 + (uint8(b[i]) - 0x30);
            }
        }
        return result;
    }
    
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    function _addressToString(address addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}