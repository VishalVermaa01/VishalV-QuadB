# Install Solana CLI & Set Up a Basic Hello World Rust Project

This guide explains the steps to install the Solana CLI, set up a Rust project, and create a basic "Hello, World!" Rust program.

---

## Prerequisites

Ensure you have the following installed:
- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli)

---

## Step 1: Install Solana CLI

To install the Solana CLI, run:
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

After installation, restart your terminal or run:
```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

Verify the installation:
```bash
solana --version
```
Expected output:
```
solana-cli X.Y.Z
```

---

## Step 2: Install Rust

Install Rust using:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

Verify the installation:
```bash
rustc --version
```

---

## Step 3: Create a Basic Rust Project

Create a new Rust project:
```bash
cargo new hello-world
cd hello-world
```

Edit `src/main.rs` and replace its contents with:
```rust
fn main() {
    println!("Hello, world!");
}
```

Compile and run the program:
```bash
cargo run
```
Expected output:
```
Hello, world!
```

---

## Step 4: Configure Solana CLI

Set your Solana keypair path:
```bash
solana config set --keypair /home/heimdall/new-keypair.json
```

Verify the configuration:
```bash
solana config get
```
Expected output:
```
Config File: /home/heimdall/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /home/heimdall/new-keypair.json
Commitment: confirmed
```

---

## Conclusion

You have successfully installed the Solana CLI and set up a basic Rust project.

