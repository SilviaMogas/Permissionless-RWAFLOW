// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./FlowPassportMembership.sol";

contract FlowPassportRegistry is Ownable, ReentrancyGuard {
    
    FlowPassportMembership public membershipContract;
    
    struct ChildNFT {
        address contractAddress;
        uint256 tokenId;
        string nftType; // "certificate" or "asset"
        string metadata;
        uint256 timestamp;
        bool isActive;
    }
    
    struct UserProfile {
        uint256 membershipTokenId;
        uint256 totalChildNFTs;
        uint256 certificateCount;
        uint256 assetCount;
        uint256 reputationScore;
        uint256 joinTimestamp;
        bool isActive;
    }
    
    // Mapping from user address to their profile
    mapping(address => UserProfile) public userProfiles;
    
    // Mapping from user address to array of child NFT IDs
    mapping(address => uint256[]) public userChildNFTs;
    
    // Mapping from child NFT ID to child NFT info
    mapping(uint256 => ChildNFT) public childNFTs;
    
    // Counter for child NFT IDs
    uint256 private _nextChildNFTId = 1;
    
    // Mapping to track authorized contracts that can add child NFTs
    mapping(address => bool) public authorizedContracts;
    
    // Events
    event MembershipLinked(
        address indexed user,
        uint256 indexed membershipTokenId,
        uint256 timestamp
    );
    
    event ChildNFTAdded(
        address indexed user,
        uint256 indexed childNFTId,
        address indexed contractAddress,
        uint256 tokenId,
        string nftType
    );
    
    event ChildNFTRemoved(
        address indexed user,
        uint256 indexed childNFTId
    );
    
    event ContractAuthorized(address indexed contractAddress, bool authorized);
    
    event ReputationUpdated(
        address indexed user,
        uint256 oldScore,
        uint256 newScore
    );
    
    constructor(
        address initialOwner,
        address _membershipContract
    ) Ownable(initialOwner) {
        membershipContract = FlowPassportMembership(_membershipContract);
    }
    
    modifier onlyAuthorizedContract() {
        require(
            authorizedContracts[msg.sender] || msg.sender == owner(),
            "Only authorized contracts can call this function"
        );
        _;
    }
    
    modifier onlyMembershipContract() {
        require(
            msg.sender == address(membershipContract),
            "Only membership contract can call this function"
        );
        _;
    }
    
    function createOrLinkMembership(address user) external nonReentrant returns (uint256) {
        return _createOrLinkMembership(user);
    }
    
    function _createOrLinkMembership(address user) internal returns (uint256) {
        require(user != address(0), "Invalid user address");
        
        uint256 membershipTokenId;
        
        // Check if user already has membership
        if (membershipContract.hasMembership(user)) {
            membershipTokenId = membershipContract.getMembershipTokenId(user);
        } else {
            // Create new membership
            membershipTokenId = membershipContract.createMembership(user);
        }
        
        // Update or create user profile
        if (userProfiles[user].membershipTokenId == 0) {
            userProfiles[user] = UserProfile({
                membershipTokenId: membershipTokenId,
                totalChildNFTs: 0,
                certificateCount: 0,
                assetCount: 0,
                reputationScore: 100,
                joinTimestamp: block.timestamp,
                isActive: true
            });
            
            emit MembershipLinked(user, membershipTokenId, block.timestamp);
        }
        
        return membershipTokenId;
    }
    
    function addChildNFT(
        address user,
        address contractAddress,
        uint256 tokenId,
        string memory nftType,
        string memory metadata
    ) external onlyAuthorizedContract returns (uint256) {
        return _addChildNFT(user, contractAddress, tokenId, nftType, metadata);
    }
    
    function _addChildNFT(
        address user,
        address contractAddress,
        uint256 tokenId,
        string memory nftType,
        string memory metadata
    ) internal returns (uint256) {
        require(user != address(0), "Invalid user address");
        require(contractAddress != address(0), "Invalid contract address");
        require(
            keccak256(abi.encodePacked(nftType)) == keccak256(abi.encodePacked("certificate")) ||
            keccak256(abi.encodePacked(nftType)) == keccak256(abi.encodePacked("asset")),
            "Invalid NFT type"
        );
        
        // Ensure user has membership
        if (!membershipContract.hasMembership(user)) {
            _createOrLinkMembership(user);
        }
        
        uint256 childNFTId = _nextChildNFTId++;
        
        // Store child NFT info
        childNFTs[childNFTId] = ChildNFT({
            contractAddress: contractAddress,
            tokenId: tokenId,
            nftType: nftType,
            metadata: metadata,
            timestamp: block.timestamp,
            isActive: true
        });
        
        // Add to user's child NFT list
        userChildNFTs[user].push(childNFTId);
        
        // Update user profile
        userProfiles[user].totalChildNFTs++;
        
        if (keccak256(abi.encodePacked(nftType)) == keccak256(abi.encodePacked("certificate"))) {
            userProfiles[user].certificateCount++;
            membershipContract.incrementCertificateCount(user);
        } else if (keccak256(abi.encodePacked(nftType)) == keccak256(abi.encodePacked("asset"))) {
            userProfiles[user].assetCount++;
            membershipContract.incrementAssetCount(user);
        }
        
        emit ChildNFTAdded(user, childNFTId, contractAddress, tokenId, nftType);
        
        return childNFTId;
    }
    
    function removeChildNFT(address user, uint256 childNFTId) external onlyAuthorizedContract {
        require(childNFTs[childNFTId].isActive, "Child NFT is not active");
        
        // Deactivate child NFT
        childNFTs[childNFTId].isActive = false;
        
        // Update user profile counts
        string memory nftType = childNFTs[childNFTId].nftType;
        userProfiles[user].totalChildNFTs--;
        
        if (keccak256(abi.encodePacked(nftType)) == keccak256(abi.encodePacked("certificate"))) {
            userProfiles[user].certificateCount--;
        } else if (keccak256(abi.encodePacked(nftType)) == keccak256(abi.encodePacked("asset"))) {
            userProfiles[user].assetCount--;
        }
        
        emit ChildNFTRemoved(user, childNFTId);
    }
    
    function getUserProfile(address user) external view returns (UserProfile memory) {
        return userProfiles[user];
    }
    
    function getUserChildNFTs(address user) external view returns (uint256[] memory) {
        return userChildNFTs[user];
    }
    
    function getUserChildNFTsByType(address user, string memory nftType) external view returns (uint256[] memory) {
        return _getUserChildNFTsByType(user, nftType);
    }
    
    function _getUserChildNFTsByType(address user, string memory nftType) internal view returns (uint256[] memory) {
        uint256[] memory allChildNFTs = userChildNFTs[user];
        uint256[] memory tempResult = new uint256[](allChildNFTs.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < allChildNFTs.length; i++) {
            uint256 childNFTId = allChildNFTs[i];
            if (childNFTs[childNFTId].isActive && 
                keccak256(abi.encodePacked(childNFTs[childNFTId].nftType)) == keccak256(abi.encodePacked(nftType))) {
                tempResult[count] = childNFTId;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tempResult[i];
        }
        
        return result;
    }
    
    function getChildNFTInfo(uint256 childNFTId) external view returns (ChildNFT memory) {
        return childNFTs[childNFTId];
    }
    
    function getUserCertificates(address user) external view returns (uint256[] memory) {
        return _getUserChildNFTsByType(user, "certificate");
    }
    
    function getUserAssets(address user) external view returns (uint256[] memory) {
        return _getUserChildNFTsByType(user, "asset");
    }
    
    function getCompleteUserProfile(address user) external view returns (
        UserProfile memory profile,
        uint256[] memory certificates,
        uint256[] memory assets
    ) {
        profile = userProfiles[user];
        certificates = _getUserChildNFTsByType(user, "certificate");
        assets = _getUserChildNFTsByType(user, "asset");
    }
    
    function getTotalUsers() external view returns (uint256) {
        return membershipContract.getTotalMemberships();
    }
    
    function getTotalChildNFTs() external view returns (uint256) {
        return _nextChildNFTId - 1;
    }
    
    function getTopUsersByReputation(uint256 limit) external view returns (address[] memory, uint256[] memory) {
        (address[] memory allMembers, uint256[] memory allTokenIds) = membershipContract.getAllMemberships();
        
        uint256 totalUsers = allMembers.length;
        if (limit > totalUsers) {
            limit = totalUsers;
        }
        
        // Create arrays to store users and their reputation scores
        address[] memory users = new address[](totalUsers);
        uint256[] memory reputations = new uint256[](totalUsers);
        
        // Populate arrays
        for (uint256 i = 0; i < totalUsers; i++) {
            users[i] = allMembers[i];
            reputations[i] = userProfiles[allMembers[i]].reputationScore;
        }
        
        // Simple bubble sort for reputation (in descending order)
        for (uint256 i = 0; i < totalUsers - 1; i++) {
            for (uint256 j = 0; j < totalUsers - i - 1; j++) {
                if (reputations[j] < reputations[j + 1]) {
                    // Swap reputations
                    uint256 tempRep = reputations[j];
                    reputations[j] = reputations[j + 1];
                    reputations[j + 1] = tempRep;
                    
                    // Swap users
                    address tempUser = users[j];
                    users[j] = users[j + 1];
                    users[j + 1] = tempUser;
                }
            }
        }
        
        // Return top users
        address[] memory topUsers = new address[](limit);
        uint256[] memory topReputations = new uint256[](limit);
        
        for (uint256 i = 0; i < limit; i++) {
            topUsers[i] = users[i];
            topReputations[i] = reputations[i];
        }
        
        return (topUsers, topReputations);
    }
    
    function authorizeContract(address contractAddress, bool authorized) external onlyOwner {
        require(contractAddress != address(0), "Invalid contract address");
        authorizedContracts[contractAddress] = authorized;
        emit ContractAuthorized(contractAddress, authorized);
    }
    
    function updateMembershipContract(address newMembershipContract) external onlyOwner {
        require(newMembershipContract != address(0), "Invalid membership contract address");
        membershipContract = FlowPassportMembership(newMembershipContract);
    }
    
    function updateUserReputation(address user, uint256 newScore) external onlyOwner {
        require(userProfiles[user].membershipTokenId != 0, "User profile does not exist");
        
        uint256 oldScore = userProfiles[user].reputationScore;
        userProfiles[user].reputationScore = newScore;
        
        // Update reputation in membership contract
        membershipContract.updateReputationScore(user, newScore);
        
        emit ReputationUpdated(user, oldScore, newScore);
    }
    
    function deactivateUser(address user) external onlyOwner {
        require(userProfiles[user].membershipTokenId != 0, "User profile does not exist");
        userProfiles[user].isActive = false;
    }
    
    function reactivateUser(address user) external onlyOwner {
        require(userProfiles[user].membershipTokenId != 0, "User profile does not exist");
        userProfiles[user].isActive = true;
    }
    
    // Batch operations for gas efficiency
    function batchAddChildNFTs(
        address[] memory users,
        address[] memory contractAddresses,
        uint256[] memory tokenIds,
        string[] memory nftTypes,
        string[] memory metadatas
    ) external onlyAuthorizedContract returns (uint256[] memory) {
        require(
            users.length == contractAddresses.length &&
            users.length == tokenIds.length &&
            users.length == nftTypes.length &&
            users.length == metadatas.length,
            "Array length mismatch"
        );
        
        uint256[] memory childNFTIds = new uint256[](users.length);
        
        for (uint256 i = 0; i < users.length; i++) {
            childNFTIds[i] = _addChildNFT(
                users[i],
                contractAddresses[i],
                tokenIds[i],
                nftTypes[i],
                metadatas[i]
            );
        }
        
        return childNFTIds;
    }
}