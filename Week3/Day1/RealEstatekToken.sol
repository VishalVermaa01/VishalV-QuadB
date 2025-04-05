// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RentableRealEstate is ERC721Enumerable, Ownable {
    struct RentalInfo {
        address renter;
        uint256 expiry;
    }

    mapping(uint256 => RentalInfo) public rentals;
    mapping(uint256 => uint256) public rentalPrices; // Price per rental period
    uint256 public rentalPeriod = 30 days; // Default rental period

    event Rented(uint256 tokenId, address renter, uint256 expiry);
    event RentExpired(uint256 tokenId);

    constructor() ERC721("RentableRealEstate", "RRE") Ownable(msg.sender) {}


    function mintProperty(address to, uint256 tokenId, uint256 price) external onlyOwner {
        _safeMint(to, tokenId);
        rentalPrices[tokenId] = price;
    }

    function rentProperty(uint256 tokenId) external payable {
        require(ownerOf(tokenId) != msg.sender, "Owner can't rent own property");
        require(block.timestamp >= rentals[tokenId].expiry, "Property is currently rented");
        require(msg.value == rentalPrices[tokenId], "Incorrect rental payment");

        rentals[tokenId] = RentalInfo(msg.sender, block.timestamp + rentalPeriod);
        emit Rented(tokenId, msg.sender, rentals[tokenId].expiry);
    }

    function checkRentExpiry(uint256 tokenId) external {
        require(block.timestamp >= rentals[tokenId].expiry, "Rental still active");

        rentals[tokenId].renter = address(0); // Reset renter
        emit RentExpired(tokenId);
    }

    function getRenter(uint256 tokenId) external view returns (address) {
        return rentals[tokenId].renter;
    }
}
