// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AcademyCertification is Ownable {
    
    struct ExamResult {
        uint256 score;
        uint256 totalQuestions;
        uint256 timestamp;
        bool passed; // true if score >= 50%
    }
    
    // Module levels
    enum ModuleLevel { BEGINNER, INTERMEDIATE, ADVANCED }
    
    // Mapping from user address to module level to exam result
    mapping(address => mapping(ModuleLevel => ExamResult)) public examResults;
    
    // Mapping to track if user has passed a specific module
    mapping(address => mapping(ModuleLevel => bool)) public hasPassed;
    
    // Track total number of users who have taken each module
    mapping(ModuleLevel => uint256) public totalParticipants;
    
    // Track total number of users who have passed each module
    mapping(ModuleLevel => uint256) public totalPassed;
    
    // Events
    event ExamCompleted(
        address indexed user,
        ModuleLevel indexed moduleLevel,
        uint256 score,
        uint256 totalQuestions,
        bool passed
    );
    
    event ExamRetaken(
        address indexed user,
        ModuleLevel indexed moduleLevel,
        uint256 newScore,
        uint256 oldScore,
        bool passed
    );
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    function submitExamResult(
        address user,
        ModuleLevel moduleLevel,
        uint256 score,
        uint256 totalQuestions
    ) external onlyOwner {
        require(score <= totalQuestions, "Score cannot exceed total questions");
        require(totalQuestions > 0, "Total questions must be greater than 0");
        
        // Calculate if passed (50% or higher)
        bool passed = (score * 100) >= (totalQuestions * 50);
        
        // Check if this is a retake
        bool isRetake = examResults[user][moduleLevel].timestamp > 0;
        uint256 oldScore = examResults[user][moduleLevel].score;
        
        // Update exam result
        examResults[user][moduleLevel] = ExamResult({
            score: score,
            totalQuestions: totalQuestions,
            timestamp: block.timestamp,
            passed: passed
        });
        
        // Update pass status
        bool previouslyPassed = hasPassed[user][moduleLevel];
        hasPassed[user][moduleLevel] = passed;
        
        // Update statistics
        if (!isRetake) {
            totalParticipants[moduleLevel]++;
        }
        
        // Update pass count if status changed
        if (passed && !previouslyPassed) {
            totalPassed[moduleLevel]++;
        } else if (!passed && previouslyPassed) {
            totalPassed[moduleLevel]--;
        }
        
        // Emit appropriate event
        if (isRetake) {
            emit ExamRetaken(user, moduleLevel, score, oldScore, passed);
        } else {
            emit ExamCompleted(user, moduleLevel, score, totalQuestions, passed);
        }
    }
    
    function hasPassedModule(address user, ModuleLevel moduleLevel) external view returns (bool) {
        return hasPassed[user][moduleLevel];
    }
    
    function getExamResult(address user, ModuleLevel moduleLevel) external view returns (ExamResult memory) {
        return examResults[user][moduleLevel];
    }
    
    function getUserPassedModules(address user) external view returns (bool[] memory) {
        bool[] memory passedModules = new bool[](3);
        passedModules[0] = hasPassed[user][ModuleLevel.BEGINNER];
        passedModules[1] = hasPassed[user][ModuleLevel.INTERMEDIATE];
        passedModules[2] = hasPassed[user][ModuleLevel.ADVANCED];
        return passedModules;
    }
    
    function getModuleStats(ModuleLevel moduleLevel) external view returns (uint256 participants, uint256 passed, uint256 passRate) {
        participants = totalParticipants[moduleLevel];
        passed = totalPassed[moduleLevel];
        passRate = participants > 0 ? (passed * 100) / participants : 0;
    }
    
    function getAllUserStats(address user) external view returns (
        uint256[] memory scores,
        uint256[] memory totalQuestions,
        uint256[] memory timestamps,
        bool[] memory passedStatus
    ) {
        scores = new uint256[](3);
        totalQuestions = new uint256[](3);
        timestamps = new uint256[](3);
        passedStatus = new bool[](3);
        
        for (uint i = 0; i < 3; i++) {
            ModuleLevel level = ModuleLevel(i);
            ExamResult memory result = examResults[user][level];
            scores[i] = result.score;
            totalQuestions[i] = result.totalQuestions;
            timestamps[i] = result.timestamp;
            passedStatus[i] = result.passed;
        }
    }
    
    function hasAttemptedModule(address user, ModuleLevel moduleLevel) external view returns (bool) {
        return examResults[user][moduleLevel].timestamp > 0;
    }
    
    function getPassPercentage(address user, ModuleLevel moduleLevel) external view returns (uint256) {
        ExamResult memory result = examResults[user][moduleLevel];
        if (result.totalQuestions == 0) {
            return 0;
        }
        return (result.score * 100) / result.totalQuestions;
    }
    
    // Function to get module level from string (helper for frontend)
    function getModuleLevelFromString(string memory moduleLevel) external pure returns (ModuleLevel) {
        bytes32 levelHash = keccak256(abi.encodePacked(moduleLevel));
        
        if (levelHash == keccak256(abi.encodePacked("BEGINNER"))) {
            return ModuleLevel.BEGINNER;
        } else if (levelHash == keccak256(abi.encodePacked("INTERMEDIATE"))) {
            return ModuleLevel.INTERMEDIATE;
        } else if (levelHash == keccak256(abi.encodePacked("ADVANCED"))) {
            return ModuleLevel.ADVANCED;
        } else {
            revert("Invalid module level");
        }
    }
    
    // Emergency function to reset a user's exam results (owner only)
    function resetUserExamResults(address user, ModuleLevel moduleLevel) external onlyOwner {
        require(examResults[user][moduleLevel].timestamp > 0, "User has not taken this exam");
        
        bool wasPassed = hasPassed[user][moduleLevel];
        
        // Reset the exam result
        delete examResults[user][moduleLevel];
        hasPassed[user][moduleLevel] = false;
        
        // Update statistics
        totalParticipants[moduleLevel]--;
        if (wasPassed) {
            totalPassed[moduleLevel]--;
        }
    }
}