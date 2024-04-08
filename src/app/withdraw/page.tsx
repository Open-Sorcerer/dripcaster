"use client";

import { Spinner } from "@/components";
import type { WormholeConnectConfig } from "@wormhole-foundation/wormhole-connect";
import dynamic from "next/dynamic";

const WormholeConnect = dynamic(
  () => import("@wormhole-foundation/wormhole-connect").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    ),
  },
);

const config: WormholeConnectConfig = {
  env: "mainnet",
  networks: ["base", "solana"],
  tokens: ["ETH", "USDC"],
  rpcs: {
    base: "https://rpc.ankr.com/base",
    solana: "https://rpc.ankr.com/solana",
  },
};

const Withdraw = () => {
  return (
    <div className="w-full pt-20 pb-5 px-5 md:px-40">
      <WormholeConnect config={config} />
    </div>
  );
};

export default Withdraw;
