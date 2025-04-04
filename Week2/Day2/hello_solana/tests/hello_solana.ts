import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { HelloSolana } from "../target/types/hello_solana";

describe("hello_solana", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.HelloSolana as Program<HelloSolana>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
