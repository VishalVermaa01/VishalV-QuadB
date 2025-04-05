const { expect } = require("chai");
const { ethers } = require("hardhat");
const deployed = require("../ignition/deployments/localhost/SafeBankModule.json");

describe("SafeBank (Ignition Deployed) - Attack Attempt", function () {
  let safeBank;
  let attacker;
  let malicious;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    malicious = signers[1]; // attacker account

    // Get deployed SafeBank address
    const safeBankAddress = deployed.contracts.SafeBankModule.contracts.SafeBank.address;
    safeBank = await ethers.getContractAt("SafeBank", safeBankAddress);

    // Deploy Attacker pointing to SafeBank
    const Attacker = await ethers.getContractFactory("Attacker");
    attacker = await Attacker.connect(malicious).deploy(safeBank.address, { value: ethers.utils.parseEther("1") });
    await attacker.deployed();

    // Deposit ETH from attacker into SafeBank
    await safeBank.connect(malicious).deposit({ value: ethers.utils.parseEther("1") });

    // Fast forward to unlock withdrawal
    await ethers.provider.send("evm_increaseTime", [60]);
    await ethers.provider.send("evm_mine");
  });

  it("should prevent reentrancy attack via time lock", async () => {
    // Attempt attack (which calls bank.withdraw() inside fallback)
    await expect(attacker.connect(malicious).attack()).to.be.revertedWith("Funds are time-locked");

    // Ensure funds are still in bank
    const balance = await safeBank.balances(malicious.address);
    expect(balance).to.equal(ethers.utils.parseEther("1"));
  });
});

