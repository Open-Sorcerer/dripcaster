"use client";
import WormholeConnect, { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";

const config: WormholeConnectConfig = {
  env: "mainnet",
  networks: ["base", "solana"],
  tokens: ["ETH", "USDC"],
  rpcs: {
    base: "https://rpc.ankr.com/base",
    solana: "https://rpc.ankr.com/solana",
  },
};

function Withdraw() {
  return (
    <div className="w-full pt-20 pb-5 px-5 md:px-40">
      <WormholeConnect config={config} />
    </div>
  );
}

export default Withdraw;
