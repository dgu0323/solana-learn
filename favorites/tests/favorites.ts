import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Favorites } from "../target/types/favorites"; // 确保路径正确
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import * as fs from "fs";

async function main() {
  // 读取本地钱包
  const keypairPath = "/Users/yc/.config/solana/id.json";
  const keypairData = JSON.parse(fs.readFileSync(keypairPath, "utf-8"));
  const userKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));

  // 配置 Anchor 提供者
  const connection = new anchor.web3.Connection("http://127.0.0.1:8899", "processed");
  const wallet = new anchor.Wallet(userKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
    commitment: "processed",
  });
  anchor.setProvider(provider);

  const program = anchor.workspace.Favorites as Program<Favorites>;

  // 计算 Favorites PDA
  const [favoritesPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("fav"), userKeypair.publicKey.toBuffer()],
    program.programId
  );

  console.log("PDA地址:", favoritesPda.toBase58());

  // 调用参数
  const favoriteNumber = new BN(42);
  const favoriteColor = "green";

  // 使用类型断言绕过类型检查
  try {
    const txId = await program.methods
      .setFavorites(favoriteNumber, favoriteColor)
      .accounts({
        user: userKeypair.publicKey,
        fav: favoritesPda,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([userKeypair])
      .rpc();
    
    console.log("交易ID:", txId);
    console.log("在浏览器中查看: https://explorer.solana.com/tx/" + txId + "?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899");
  } catch (error) {
    console.error("交易失败:", error);
    return; // 如果交易失败，不继续执行
  }

  // 获取并输出结果
  try {
    // 使用类型断言绕过类型检查
    const favoritesAccount = await (program.account as any).favData.fetch(favoritesPda);
    console.log(
      `User ${userKeypair.publicKey.toBase58()}'s fav: number=${
        favoritesAccount.number
      }, color=${favoritesAccount.color}`
    );
  } catch (error) {
    console.error("无法获取账户数据:", error);
  }
}

main().catch((err) => {
  console.error("Error:", err);
});