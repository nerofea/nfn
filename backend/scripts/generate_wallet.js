// generate_wallet.js
import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import fs from "fs";

(async () => {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const wallet = Keypair.generate();

  console.log("Public Key:", wallet.publicKey.toBase58());

  fs.writeFileSync("user-wallet.json", JSON.stringify(Array.from(wallet.secretKey)));

  const airdropSig = await connection.requestAirdrop(wallet.publicKey, 1 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropSig);

  console.log("✅ Funded with 1 SOL (devnet)");
})();


// /backend/utils/generate_wallet.js
import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import fs from "fs";

export async function generateWalletForUser(userId) {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const wallet = Keypair.generate();

  console.log("Generated wallet:", wallet.publicKey.toBase58());

  fs.writeFileSync(`./wallets/${userId}.json`, JSON.stringify(Array.from(wallet.secretKey)));

  const airdropSig = await connection.requestAirdrop(wallet.publicKey, 1 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropSig);

  return {
    publicKey: wallet.publicKey.toBase58(),
    secretKey: Array.from(wallet.secretKey),
  };
}
