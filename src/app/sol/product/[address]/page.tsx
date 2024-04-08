"use client";

import { Preview } from "@/components";
import { publicClient } from "@/config";
import { DripsABI } from "@/constant/abi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getContract } from "viem";
import { useAccount } from "wagmi";

const Product = ({ params }: { params: { address: string } }) => {
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
    <div className="w-full h-full pt-20 pb-5 px-5 md:px-40">
      <div className="flex flex-col mt-5 gap-3 text-sky-400 items-center justify-center">
        {showContent ? <h1>Content is available</h1> : <h1>Content is not available</h1>}
        {/* <Preview content={""} type="none" /> */}
        <div className="flex flex-col md:flex-row gap-5 bg-[#080808] bg-opacity-30 w-fit p-10 rounded-xl">
          <Image
            className="mx-auto w-[20rem] h-[20rem] bg-gradient-to-tr from-teal-500 to-sky-400 rounded-lg object-fill"
            src={"/images/preview-icon.png"}
            alt="product"
            width={200}
            height={200}
          />
          <div className="flex flex-col p-2 h-full">
            <h1 className="w-[20rem] text-3xl font-title text-neutral-50">Product Name</h1>
            <p className="w-[30rem] mt-2 font-primary text-neutral-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum rerum cum numquam
              eius distinctio ducimus, quo ipsa perferendis aliquid harum nisi aliquam iste libero
              laborum. Ratione consequuntur nostrum officiis neque?
            </p>
            <div className="flex flex-row gap-2 mt-4 items-center font-primary">
              <Image
                className="w-5 h-5"
                src={"/svgs/solana.svg"}
                alt="product"
                width={200}
                height={200}
              />
              <p className="text-lg text-teal-400 font-medium">0.01</p>
            </div>
            <button className="w-[8rem] h-10 bg-gradient-to-r from-amber-300 to-amber-400 text-neutral-800 font-semibold rounded-lg mt-4">
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
