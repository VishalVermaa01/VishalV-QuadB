const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SafeBank", function () {
  let safeBank, attacker;
  let deployer, user, malicious;

  beforeEach(async function () {
    [deployer, user, malicious] = await ethers.getSigners();

    const SafeBank = await ethers.getContractFactory("SafeBank");
    safeBank = await SafeBank.deploy();
    await safeBank.deployed();

    const Attacker = await ethers.getContractFactory("Attacker");
    attacker = await Attacker.deploy(safeBank.address); // Pointing to SafeBank
    await attacker.deployed();
  });

  it("should allow deposits", async () => {
    await safeBank.connect(user).deposit({ value: ethers.utils.parseEther("1") });
    const balance = await safeBank.getBalance();
    expect(balance).to.equal(ethers.utils.parseEther("1"));
  });

  it("should block withdrawal before lock time", async () => {
    await safeBank.connect(user).deposit({ value: ethers.utils.parseEther("1") });

    await expect(safeBank.connect(user).withdraw()).to.be.revertedWith("Funds are time-locked");
  });

  it("should allow withdrawal after lock time", async () => {
    await safeBank.connect(user).deposit({ value: ethers.utils.parseEther("1") });

    // Fast forward time
    await ethers.provider.send("evm_increaseTime", [60]); // 60 seconds
    await ethers.provider.send("evm_mine");

    await expect(safeBank.connect(user).withdraw()).to.changeEtherBalance(user, ethers.utils.parseEther("1"));
  });

  it("should prevent reentrancy attack", async () => {
    // Fund attacker contract
    await safeBank.connect(malicious).deposit({ value: ethers.utils.parseEther("1") });
    await attacker.connect(malicious).fund({ value: ethers.utils.parseEther("1") });

    // Fast forward so withdraw is unlocked
    await ethers.provider.send("evm_increaseTime", [60]);
    await ethers.provider.send("evm_mine");

    await expect(attacker.connect(malicious).attack()).to.be.revertedWith("Funds are time-locked");
  });
});
