const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SafeBank with protection against reentrancy", function () {
  let deployer, attackerEOA;
  let safeBank, attacker;

  beforeEach(async () => {
    [deployer, attackerEOA] = await ethers.getSigners();

    const SafeBank = await ethers.getContractFactory("SafeBank");
    safeBank = await SafeBank.deploy();
    await safeBank.waitForDeployment();

    const Attacker = await ethers.getContractFactory("Attacker");
    attacker = await Attacker.connect(attackerEOA).deploy(await safeBank.getAddress(), {
      value: ethers.parseEther("1")
    });
    await attacker.waitForDeployment();

    // EOA deposits 1 ETH to safe bank
    await safeBank.connect(attackerEOA).deposit({ value: ethers.parseEther("1") });

    // Wait 1 min to bypass time lock
    await ethers.provider.send("evm_increaseTime", [60]);
    await ethers.provider.send("evm_mine");
  });

  it("should prevent reentrancy attack", async () => {
    await expect(
      attacker.connect(attackerEOA).attack()
    ).to.be.revertedWith("Insufficient balance");
  
    const bankBalance = await ethers.provider.getBalance(await safeBank.getAddress());
    expect(bankBalance).to.equal(ethers.parseEther("1"));
  });
  
});
