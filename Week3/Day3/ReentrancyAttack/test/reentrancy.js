const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reentrancy Attack", function () {
  let bank, attacker, deployer, user, attackerSigner;

  beforeEach(async () => {
    [deployer, user, attackerSigner] = await ethers.getSigners();

    const Bank = await ethers.getContractFactory("VulnerableBank", deployer);
    bank = await Bank.deploy();
    await bank.waitForDeployment();

    // User deposits 10 ETH to the bank
    await bank.connect(user).deposit({ value: ethers.parseEther("10") });

    const Attacker = await ethers.getContractFactory("Attacker", attackerSigner);
    attacker = await Attacker.deploy(await bank.getAddress());
    await attacker.waitForDeployment();
  });

  it("should drain the bank using reentrancy", async () => {
    const bankAddress = await bank.getAddress();
    const attackerAddress = await attacker.getAddress();

    // Attacker deposits and triggers the attack
    await attacker.connect(attackerSigner).attack({ value: ethers.parseEther("1") });

    const bankBalance = await ethers.provider.getBalance(bankAddress);
    const attackerBalance = await ethers.provider.getBalance(attackerAddress);

    console.log("Bank balance after attack:", ethers.formatEther(bankBalance));
    console.log("Attacker contract balance after attack:", ethers.formatEther(attackerBalance));

    expect(bankBalance).to.equal(0n);
    expect(attackerBalance).to.be.greaterThanOrEqual(ethers.parseEther("10"));
  });
});
