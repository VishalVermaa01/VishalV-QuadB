const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SafeBankAttackModule", (m) => {
  const safeBank = m.contract("SafeBank");
  const attacker = m.contract("Attacker", [safeBank]);

  return { safeBank, attacker };
});
