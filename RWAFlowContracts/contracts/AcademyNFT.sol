// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./AcademyCertification.sol";

contract AcademyNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    
    AcademyCertification public academyCertification;
    
    uint256 private _nextTokenId = 1;
    
    struct CertificateInfo {
        address recipient;
        AcademyCertification.ModuleLevel moduleLevel;
        uint256 score;
        uint256 totalQuestions;
        uint256 timestamp;
        string metadataURI;
    }
    
    // Mapping from token ID to certificate info
    mapping(uint256 => CertificateInfo) public certificates;
    
    // Mapping from user address to module level to token ID (to prevent duplicate NFTs)
    mapping(address => mapping(AcademyCertification.ModuleLevel => uint256)) public userCertificates;
    
    // Mapping to check if user has minted NFT for a specific module
    mapping(address => mapping(AcademyCertification.ModuleLevel => bool)) public hasMintedNFT;
    
    // Base metadata URIs for each module level
    mapping(AcademyCertification.ModuleLevel => string) public baseTokenURIs;
    
    // Events
    event CertificateIssued(
        address indexed recipient,
        uint256 indexed tokenId,
        AcademyCertification.ModuleLevel indexed moduleLevel,
        uint256 score,
        uint256 totalQuestions
    );
    
    event BaseURIUpdated(AcademyCertification.ModuleLevel indexed moduleLevel, string newURI);
    
    constructor(
        address initialOwner,
        address _academyCertification
    ) ERC721("Flow Passport Academy Certificate", "FPAC") Ownable(initialOwner) {
        academyCertification = AcademyCertification(_academyCertification);
        
        // Set default metadata URIs (can be updated later)
        baseTokenURIs[AcademyCertification.ModuleLevel.BEGINNER] = "https://gateway.pinata.cloud/ipfs/QmBeginnerCertificate/";
        baseTokenURIs[AcademyCertification.ModuleLevel.INTERMEDIATE] = "https://gateway.pinata.cloud/ipfs/QmIntermediateCertificate/";
        baseTokenURIs[AcademyCertification.ModuleLevel.ADVANCED] = "https://gateway.pinata.cloud/ipfs/QmAdvancedCertificate/";
    }
    
    function mintCertificate(AcademyCertification.ModuleLevel moduleLevel) external nonReentrant {
        address user = msg.sender;
        
        // Check if user has passed the module
        require(
            academyCertification.hasPassedModule(user, moduleLevel),
            "User has not passed this module"
        );
        
        // Check if user has already minted NFT for this module
        require(
            !hasMintedNFT[user][moduleLevel],
            "Certificate already minted for this module"
        );
        
        // Get exam result details
        AcademyCertification.ExamResult memory examResult = academyCertification.getExamResult(user, moduleLevel);
        
        uint256 tokenId = _nextTokenId++;
        
        // Mint the NFT
        _safeMint(user, tokenId);
        
        // Generate metadata URI
        string memory metadataURI = _generateMetadataURI(moduleLevel, examResult.score, examResult.totalQuestions);
        _setTokenURI(tokenId, metadataURI);
        
        // Store certificate info
        certificates[tokenId] = CertificateInfo({
            recipient: user,
            moduleLevel: moduleLevel,
            score: examResult.score,
            totalQuestions: examResult.totalQuestions,
            timestamp: block.timestamp,
            metadataURI: metadataURI
        });
        
        // Update mappings
        userCertificates[user][moduleLevel] = tokenId;
        hasMintedNFT[user][moduleLevel] = true;
        
        emit CertificateIssued(user, tokenId, moduleLevel, examResult.score, examResult.totalQuestions);
    }
    
    function _generateMetadataURI(
        AcademyCertification.ModuleLevel moduleLevel,
        uint256 score,
        uint256 totalQuestions
    ) internal view returns (string memory) {
        // For now, return base URI. In production, this would generate dynamic metadata
        // that includes score, percentage, and module-specific information
        return string(abi.encodePacked(
            baseTokenURIs[moduleLevel],
            _toString(score),
            "_",
            _toString(totalQuestions),
            ".json"
        ));
    }
    
    function getCertificateInfo(uint256 tokenId) external view returns (CertificateInfo memory) {
        require(_ownerOf(tokenId) != address(0), "Certificate does not exist");
        return certificates[tokenId];
    }
    
    function getUserCertificates(address user) external view returns (uint256[] memory) {
        uint256[] memory userTokens = new uint256[](3);
        userTokens[0] = userCertificates[user][AcademyCertification.ModuleLevel.BEGINNER];
        userTokens[1] = userCertificates[user][AcademyCertification.ModuleLevel.INTERMEDIATE];
        userTokens[2] = userCertificates[user][AcademyCertification.ModuleLevel.ADVANCED];
        return userTokens;
    }
    
    function hasUserMintedCertificate(address user, AcademyCertification.ModuleLevel moduleLevel) external view returns (bool) {
        return hasMintedNFT[user][moduleLevel];
    }
    
    function canMintCertificate(address user, AcademyCertification.ModuleLevel moduleLevel) external view returns (bool) {
        return academyCertification.hasPassedModule(user, moduleLevel) && 
               !hasMintedNFT[user][moduleLevel];
    }
    
    function getUserMintableModules(address user) external view returns (bool[] memory) {
        bool[] memory mintable = new bool[](3);
        mintable[0] = academyCertification.hasPassedModule(user, AcademyCertification.ModuleLevel.BEGINNER) && 
                     !hasMintedNFT[user][AcademyCertification.ModuleLevel.BEGINNER];
        mintable[1] = academyCertification.hasPassedModule(user, AcademyCertification.ModuleLevel.INTERMEDIATE) && 
                     !hasMintedNFT[user][AcademyCertification.ModuleLevel.INTERMEDIATE];
        mintable[2] = academyCertification.hasPassedModule(user, AcademyCertification.ModuleLevel.ADVANCED) && 
                     !hasMintedNFT[user][AcademyCertification.ModuleLevel.ADVANCED];
        return mintable;
    }
    
    function updateBaseTokenURI(AcademyCertification.ModuleLevel moduleLevel, string memory newURI) external onlyOwner {
        baseTokenURIs[moduleLevel] = newURI;
        emit BaseURIUpdated(moduleLevel, newURI);
    }
    
    function updateAcademyCertificationContract(address newContract) external onlyOwner {
        academyCertification = AcademyCertification(newContract);
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
    
    // Function to get module level name as string (helper for frontend)
    function getModuleLevelName(AcademyCertification.ModuleLevel level) external pure returns (string memory) {
        if (level == AcademyCertification.ModuleLevel.BEGINNER) {
            return "Beginner";
        } else if (level == AcademyCertification.ModuleLevel.INTERMEDIATE) {
            return "Intermediate";
        } else if (level == AcademyCertification.ModuleLevel.ADVANCED) {
            return "Advanced";
        } else {
            return "Unknown";
        }
    }
    
    // Function to get total supply of certificates for each module
    function getModuleCertificateCounts() external view returns (uint256[] memory) {
        uint256[] memory counts = new uint256[](3);
        for (uint256 i = 1; i < _nextTokenId; i++) {
            if (_ownerOf(i) != address(0)) {
                AcademyCertification.ModuleLevel level = certificates[i].moduleLevel;
                counts[uint256(level)]++;
            }
        }
        return counts;
    }
    
    // Function to get all certificates for a specific module level
    function getCertificatesByModule(AcademyCertification.ModuleLevel moduleLevel) external view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](_nextTokenId - 1);
        uint256 count = 0;
        
        for (uint256 i = 1; i < _nextTokenId; i++) {
            if (_ownerOf(i) != address(0) && certificates[i].moduleLevel == moduleLevel) {
                tokenIds[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tokenIds[i];
        }
        return result;
    }
    
    // Soulbound functionality - prevent transfers
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) and burning (to == address(0))
        // but prevent transfers between addresses
        require(
            from == address(0) || to == address(0),
            "Certificates are soulbound and cannot be transferred"
        );
        
        return super._update(to, tokenId, auth);
    }
}