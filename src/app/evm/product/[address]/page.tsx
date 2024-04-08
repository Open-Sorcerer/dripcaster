"use client";

import { Preview } from "@/components";
import { publicClient } from "@/config";
import { DripsABI } from "@/constant/abi";
import { useEffect, useState } from "react";
import { getContract } from "viem";
import { useAccount } from "wagmi";

const Product = ({ params }: { params: { address: string } }) => {
  const { address } = useAccount();
  const [showContent, setShowContent] = useState<boolean>(false);
  const [productDataURL, setProductDataURL] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");

  const setDripContract = async () => {
    const dripContract = getContract({
      address: params.address as `0x${string}`,
      abi: DripsABI,
      client: publicClient,
    });

    const nfts = await dripContract.read.balanceOf([address, 1]);
    const productURL = await dripContract.read.dataURI();
    const previewImageURI = await dripContract.read.previewImageURI();
    console.log(previewImageURI);
    console.log(productURL);
    console.log(Number(nfts));
    if (Number(nfts) > 0 && productURL) {
      const metadataResponse = await fetch(`/api/fetch?url=${previewImageURI}`);
      const metadata = (await metadataResponse.json()) as {
        fileType: string;
      };
      console.log(metadata);
      setShowContent(true);
      setProductDataURL(productURL as string);
      setFileType(metadata.fileType);
    }
  };

  useEffect(() => {
    if (address) {
      setDripContract();
    }
  }, [address]);

  return (
    <div className="w-full h-full pt-20 pb-5 px-5 md:px-40">
      <div className="flex flex-col gap-3 text-sky-400 items-center justify-center mt-10">
        {showContent ? (
          <Preview content={productDataURL} type={fileType} />
        ) : (
          <h1>Content is not available</h1>
        )}
      </div>
    </div>
  );
};

export default Product;
