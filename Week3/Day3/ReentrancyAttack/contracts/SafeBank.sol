// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SafeBank is ReentrancyGuard {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lastDepositTime;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
        lastDepositTime[msg.sender] = block.timestamp;
    }

    function withdraw() external nonReentrant {
        require(block.timestamp >= lastDepositTime[msg.sender] + 1 minutes, "Funds are locked");
        require(balances[msg.sender] > 0, "Insufficient balance");

        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}
