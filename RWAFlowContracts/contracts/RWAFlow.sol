// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RWAFlow is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    
    constructor(address initialOwner) 
        ERC20("RWAFlow", "RWAF") 
        Ownable(initialOwner)
    {
        _mint(initialOwner, 100000000 * 10**18); // Initial mint of 100 million tokens
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "RWAFlow: amount exceeds max supply");
        _mint(to, amount);
    }
    
    function awardPoints(address user, uint256 points) public onlyOwner {
        require(totalSupply() + points <= MAX_SUPPLY, "RWAFlow: amount exceeds max supply");
        _mint(user, points);
    }
}