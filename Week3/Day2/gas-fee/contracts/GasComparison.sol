// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GasComparison {
    uint256 public storedValue;

    // Function that uses storage
    function useStorage(uint256 _val) public {
        storedValue = _val;
    }

    // Function that uses memory
    function useMemory(uint256 _val) public pure returns (uint256) {
        uint256 temp = _val;
        return temp;
    }

    // Function that performs a loop
    function loopOperation(uint256 _n) public pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < _n; i++) {
            sum += i;
        }
        return sum;
    }

    // Function that writes multiple storage variables
    uint256 public a;
    uint256 public b;
    function multipleStorageWrites(uint256 _a, uint256 _b) public {
        a = _a;
        b = _b;
    }
}
