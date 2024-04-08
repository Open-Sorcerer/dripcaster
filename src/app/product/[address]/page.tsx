"use client";

import { publicClient } from "@/config";
import { DripsABI } from "@/constant/abi";
import { useEffect, useState } from "react";
import { getContract } from "viem";
import { useAccount } from "wagmi";

const Preview = ({ params }: { params: { address: string } }) => {
  const { address } = useAccount();
  const [showContent, setShowContent] = useState<boolean>(false);
  const [productDataURL, setProductDataURL] = useState<string>("");

  const setDripContract = async () => {
    const dripContract = getContract({
      address: params.address as `0x${string}`,
      abi: DripsABI,
      client: publicClient,
    });

    const nfts = await dripContract.read.balanceOf([address, 1]);
    const productURL = await dripContract.read.dataURI();
    console.log(Number(nfts));
    if (Number(nfts) > 0 && productURL) {
      setShowContent(true);
      setProductDataURL(productURL as string);
    }
  };

  useEffect(() => {
    if (address) {
      setDripContract();
    }
  }, [address]);

  return (
    <div className="w-full pt-20 pb-5 px-5 md:px-40">
      <div className="flex flex-col gap-3 text-sky-400">
        {showContent ? <h1>Content is available</h1> : <h1>Content is not available</h1>}
      </div>
    </div>
  );
};

export default Preview;
