import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("GasComparisonModule", (m) => {
  const gasComparison = m.contract("GasComparison");

  return { gasComparison };
});
