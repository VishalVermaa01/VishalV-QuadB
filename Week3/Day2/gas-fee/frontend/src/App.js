import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import GasComparisonJSON from "./GasComparison.json";

const GasComparisonABI = GasComparisonJSON.abi;
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [gasData, setGasData] = useState(null);
  const [loading, setLoading] = useState(false);

  
  // async function measureGas(funcName, ...args) {
  //   if (!window.ethereum) return alert("Please install MetaMask");
  
  //   const provider = new BrowserProvider(window.ethereum);
  //   await provider.send("eth_requestAccounts", []);
  //   const signer = await provider.getSigner();
  //   const contract = new Contract(CONTRACT_ADDRESS, GasComparisonABI, signer);
  
  //   try {
  //     console.log(`Calling function: ${funcName} with args:`, args);
  
  //     let gasUsed;
  
  //     // If the function is read-only (view/pure), use callStatic
  //     if (["loopOperation"].includes(funcName)) {  
  //       const result = await contract.callStatic[funcName](...args);
  //       console.log(`Loop operation result for ${funcName}:`, result);
  //       return "N/A"; // Read-only functions do not consume gas
  //     } 
  
  //     // Otherwise, send a transaction
  //     const tx = await contract[funcName](...args);
  //     console.log("Transaction sent:", tx);
  
  //     const receipt = await tx.wait();
  //     console.log("Transaction receipt:", receipt);
  
  //     if (receipt && receipt.gasUsed) {
  //       gasUsed = receipt.gasUsed.toString();
  //       console.log(`Gas used for ${funcName}:`, gasUsed);
  //     } else {
  //       console.warn(`No gasUsed found in receipt for ${funcName}`);
  //       gasUsed = "Error";
  //     }
  
  //     return gasUsed;
  //   } catch (error) {
  //     console.error(`Error in ${funcName}:`, error);
  //     return "Error";
  //   }
  // }
  async function measureGas(funcName, ...args) {
    if (!window.ethereum) return alert("Please install MetaMask");
  
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, GasComparisonABI, signer);
  
    try {
      console.log(`Calling function: ${funcName} with args:`, args);
  
      // Ensure function exists before calling it
      if (!contract[funcName]) {
        console.error(`Function ${funcName} is not found in the contract!`);
        return "Function Not Found";
      }
  
      let gasUsed;
      const tx = await contract[funcName](...args);
      console.log("Transaction sent:", tx);
  
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);
  
      if (receipt && receipt.gasUsed) {
        gasUsed = receipt.gasUsed.toString();
        console.log(`Gas used for ${funcName}:`, gasUsed);
      } else {
        console.warn(`No gasUsed found in receipt for ${funcName}`);
        gasUsed = "Error";
      }
  
      return gasUsed;
    } catch (error) {
      console.error(`Error in ${funcName}:`, error);
      return "Error";
    }
  }
  
  
  

  async function compareGas() {
    setLoading(true);
    const storageGas = await measureGas("useStorage", 100);
    const memoryGas = await measureGas("useMemory", 100);
    const loopGas = await measureGas("loopOperation", 100);
    const multipleStorageGas = await measureGas("multipleStorageWrites", 10, 20);
    setLoading(false);

    setGasData({ storageGas, memoryGas, loopGas, multipleStorageGas });
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Gas Fee Tracker</h1>
      <button onClick={compareGas} disabled={loading}>
        {loading ? "Measuring..." : "Compare Gas Fees"}
      </button>
      {gasData && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Memory:</strong> {gasData.storageGas} gas</p>
          {/* <p><strong>Memory:</strong> {gasData.memoryGas} gas</p> */}
          {/* <p><strong>Loop:</strong> {gasData.loopGas} gas</p> */}
          <p><strong>Storage:</strong> {gasData.multipleStorageGas} gas</p>
        </div>
      )}
    </div>
  );
}

export default App;
