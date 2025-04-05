# 🏠 RentableRealEstate

A simple and secure Ethereum smart contract that represents **NFT-based real estate** properties which can be **rented** for a fixed duration.

Built with Solidity `^0.8.4` and uses OpenZeppelin's audited ERC721 and ownership libraries.

---

## ✨ Features

- 🏡 Mint properties as ERC721 tokens
- 💰 Assign rental prices for each property
- 🔐 Only the owner of the contract can mint properties
- 🤝 Anyone (except the owner) can rent available properties
- 📅 Fixed rental period (default: 30 days)
- ⏳ Check and expire rentals manually
- 📢 Emits events on rent and rent expiration

---

## 📦 Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/your-username/RentableRealEstate.git
   cd RentableRealEstate
