import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { UserDataAnchor } from "../target/types/user_data_anchor";

describe("User Data Program", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const program = anchor.workspace.UserDataAnchor as Program<UserDataAnchor>;

  it("Initializes a user", async () => {
    const userAccount = anchor.web3.Keypair.generate();
    
    await program.methods.initializeUser("Alice", 25)
      .accounts({
        user: userAccount.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([userAccount])
      .rpc();
    
    const userData = await program.account.user.fetch(userAccount.publicKey);
    console.log("User Data:", userData);
  });
});
