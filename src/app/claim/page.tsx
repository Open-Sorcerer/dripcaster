"use client";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";

function Claim() {
  return (
    <div className="w-full pt-20 pb-5 px-5 md:px-40">
      <WormholeConnect />
    </div>
  );
}

export default Claim;
