import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ReentrancyAttackModule = buildModule("ReentrancyAttackModule", (m) => {
  // Deploy the VulnerableBank contract
  const vulnerableBank = m.contract("VulnerableBank");

  // Deploy the Attacker contract with address of VulnerableBank
  const attacker = m.contract("Attacker", [vulnerableBank]);

  return { vulnerableBank, attacker };
});

export default ReentrancyAttackModule;
