// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FlowPassportMembership is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    
    uint256 private _nextTokenId = 1;
    
    struct MembershipInfo {
        address member;
        uint256 joinTimestamp;
        uint256 reputationScore;
        uint256 certificateCount;
        uint256 assetCount;
        string profileURI;
        bool isActive;
    }
    
    // Mapping from token ID to membership info
    mapping(uint256 => MembershipInfo) public memberships;
    
    // Mapping from user address to membership token ID
    mapping(address => uint256) public userMemberships;
    
    // Mapping to check if user has membership
    mapping(address => bool) public hasMembership;
    
    // Registry contract address (will be set after deployment)
    address public registryContract;
    
    // Base metadata URI
    string private _baseTokenURI;
    
    // Events
    event MembershipCreated(
        address indexed member,
        uint256 indexed tokenId,
        uint256 timestamp
    );
    
    event ReputationUpdated(
        address indexed member,
        uint256 indexed tokenId,
        uint256 oldScore,
        uint256 newScore
    );
    
    event ProfileUpdated(
        address indexed member,
        uint256 indexed tokenId,
        string newProfileURI
    );
    
    event RegistryContractUpdated(address indexed newRegistry);
    
    constructor(
        address initialOwner,
        string memory baseURI
    ) ERC721("Flow Passport Membership", "FPM") Ownable(initialOwner) {
        _baseTokenURI = baseURI;
    }
    
    modifier onlyMember() {
        require(hasMembership[msg.sender], "User does not have membership");
        _;
    }
    
    modifier onlyRegistryOrOwner() {
        require(
            msg.sender == registryContract || msg.sender == owner(),
            "Only registry contract or owner can call this function"
        );
        _;
    }
    
    function createMembership(address user) external nonReentrant returns (uint256) {
        require(!hasMembership[user], "User already has membership");
        require(user != address(0), "Invalid user address");
        
        uint256 tokenId = _nextTokenId++;
        
        // Mint the membership NFT
        _safeMint(user, tokenId);
        
        // Set initial metadata URI
        string memory initialURI = _generateInitialURI(user, tokenId);
        _setTokenURI(tokenId, initialURI);
        
        // Store membership info
        memberships[tokenId] = MembershipInfo({
            member: user,
            joinTimestamp: block.timestamp,
            reputationScore: 100, // Starting reputation score
            certificateCount: 0,
            assetCount: 0,
            profileURI: initialURI,
            isActive: true
        });
        
        // Update mappings
        userMemberships[user] = tokenId;
        hasMembership[user] = true;
        
        emit MembershipCreated(user, tokenId, block.timestamp);
        
        return tokenId;
    }
    
    function _generateInitialURI(address user, uint256 tokenId) internal view returns (string memory) {
        return string(abi.encodePacked(
            _baseTokenURI,
            "membership/",
            _toString(tokenId),
            ".json"
        ));
    }
    
    function getMembershipInfo(address user) external view returns (MembershipInfo memory) {
        require(hasMembership[user], "User does not have membership");
        uint256 tokenId = userMemberships[user];
        return memberships[tokenId];
    }
    
    function getMembershipTokenId(address user) external view returns (uint256) {
        require(hasMembership[user], "User does not have membership");
        return userMemberships[user];
    }
    
    function updateReputationScore(address user, uint256 newScore) external onlyRegistryOrOwner {
        require(hasMembership[user], "User does not have membership");
        
        uint256 tokenId = userMemberships[user];
        uint256 oldScore = memberships[tokenId].reputationScore;
        
        memberships[tokenId].reputationScore = newScore;
        
        emit ReputationUpdated(user, tokenId, oldScore, newScore);
    }
    
    function incrementCertificateCount(address user) external onlyRegistryOrOwner {
        require(hasMembership[user], "User does not have membership");
        
        uint256 tokenId = userMemberships[user];
        memberships[tokenId].certificateCount++;
        
        // Boost reputation for earning certificates
        _boostReputationForCertificate(tokenId);
    }
    
    function incrementAssetCount(address user) external onlyRegistryOrOwner {
        require(hasMembership[user], "User does not have membership");
        
        uint256 tokenId = userMemberships[user];
        memberships[tokenId].assetCount++;
        
        // Boost reputation for asset purchases
        _boostReputationForAsset(tokenId);
    }
    
    function _boostReputationForCertificate(uint256 tokenId) internal {
        uint256 currentScore = memberships[tokenId].reputationScore;
        uint256 boost = 50; // 50 points per certificate
        
        memberships[tokenId].reputationScore = currentScore + boost;
        
        emit ReputationUpdated(
            memberships[tokenId].member,
            tokenId,
            currentScore,
            currentScore + boost
        );
    }
    
    function _boostReputationForAsset(uint256 tokenId) internal {
        uint256 currentScore = memberships[tokenId].reputationScore;
        uint256 boost = 25; // 25 points per asset
        
        memberships[tokenId].reputationScore = currentScore + boost;
        
        emit ReputationUpdated(
            memberships[tokenId].member,
            tokenId,
            currentScore,
            currentScore + boost
        );
    }
    
    function updateProfileURI(string memory newProfileURI) external onlyMember {
        uint256 tokenId = userMemberships[msg.sender];
        
        memberships[tokenId].profileURI = newProfileURI;
        _setTokenURI(tokenId, newProfileURI);
        
        emit ProfileUpdated(msg.sender, tokenId, newProfileURI);
    }
    
    function setRegistryContract(address _registryContract) external onlyOwner {
        require(_registryContract != address(0), "Invalid registry contract address");
        registryContract = _registryContract;
        emit RegistryContractUpdated(_registryContract);
    }
    
    function updateBaseTokenURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }
    
    function getBaseTokenURI() external view returns (string memory) {
        return _baseTokenURI;
    }
    
    function getTotalMemberships() external view returns (uint256) {
        return _nextTokenId - 1;
    }
    
    function getAllMemberships() external view returns (address[] memory, uint256[] memory) {
        uint256 totalSupply = _nextTokenId - 1;
        address[] memory members = new address[](totalSupply);
        uint256[] memory tokenIds = new uint256[](totalSupply);
        
        for (uint256 i = 1; i <= totalSupply; i++) {
            if (_ownerOf(i) != address(0)) {
                members[i-1] = memberships[i].member;
                tokenIds[i-1] = i;
            }
        }
        
        return (members, tokenIds);
    }
    
    function getMembershipsByReputationRange(
        uint256 minReputation,
        uint256 maxReputation
    ) external view returns (address[] memory, uint256[] memory) {
        uint256 totalSupply = _nextTokenId - 1;
        address[] memory tempMembers = new address[](totalSupply);
        uint256[] memory tempTokenIds = new uint256[](totalSupply);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= totalSupply; i++) {
            if (_ownerOf(i) != address(0)) {
                uint256 reputation = memberships[i].reputationScore;
                if (reputation >= minReputation && reputation <= maxReputation) {
                    tempMembers[count] = memberships[i].member;
                    tempTokenIds[count] = i;
                    count++;
                }
            }
        }
        
        // Resize arrays to actual count
        address[] memory members = new address[](count);
        uint256[] memory tokenIds = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            members[i] = tempMembers[i];
            tokenIds[i] = tempTokenIds[i];
        }
        
        return (members, tokenIds);
    }
    
    // Helper function to convert uint to string
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
    
    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    // Soulbound functionality - prevent transfers
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) and burning (to == address(0))
        // but prevent transfers between addresses
        require(
            from == address(0) || to == address(0),
            "Membership NFTs are soulbound and cannot be transferred"
        );
        
        return super._update(to, tokenId, auth);
    }
    
    // Emergency function to deactivate membership (owner only)
    function deactivateMembership(address user) external onlyOwner {
        require(hasMembership[user], "User does not have membership");
        
        uint256 tokenId = userMemberships[user];
        memberships[tokenId].isActive = false;
    }
    
    // Emergency function to reactivate membership (owner only)
    function reactivateMembership(address user) external onlyOwner {
        require(hasMembership[user], "User does not have membership");
        
        uint256 tokenId = userMemberships[user];
        memberships[tokenId].isActive = true;
    }
}