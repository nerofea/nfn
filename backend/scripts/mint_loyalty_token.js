// mint_loyalty_token.js
import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
  } from "@solana/web3.js";
  import { Program, AnchorProvider, Wallet } from "@project-serum/anchor";
  import idl from "./loyalty_market.json" assert { type: "json" }; // compiled IDL
  import fs from "fs";
  
  // Load wallet
  const secret = JSON.parse(fs.readFileSync("user-wallet.json"));
  const keypair = Keypair.fromSecretKey(Uint8Array.from(secret));
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const wallet = new Wallet(keypair);
  const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program(idl, "LOYALTY_PROGRAM_ID_HERE", provider);
  
  // Call smart contract
  (async () => {
    await program.methods
      .buy(new PublicKey("BUY_TOKEN_MINT"), new PublicKey("SELL_TOKEN_MINT"), 1_000_000) // amount in base units
      .accounts({
        buyer: wallet.publicKey,
        // include other accounts: token program, destination, etc.
      })
      .rpc();
  
    console.log("✅ Buy instruction sent + loyalty token minted");
  })();
  