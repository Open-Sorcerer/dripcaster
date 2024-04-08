"use client";

import { publicClient } from "@/config";
import { DripsABI } from "@/constant/abi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getContract } from "viem";
import { useAccount } from "wagmi";
import { PublicKey, Connection } from "@solana/web3.js";
import { PublicKey as MetaPlexPublicKey } from "@metaplex-foundation/umi";
import { useWallet } from "@solana/wallet-adapter-react";
import { createTransferCheckedInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { Transaction } from "@solana/web3.js";
import { createNFTOfCollection } from "@/utils/collection";
import toast from "react-hot-toast";

const Product = ({ params }: { params: { address: string } }) => {
  const { address } = useAccount();
  const [showContent, setShowContent] = useState<boolean>(false);
  const [productDataURL, setProductDataURL] = useState<string>("");
  const [collectionAddress, setCollectionAddress] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [dripCommunities, setDripCommunities] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [metadataUrl, setMetadataUrl] = useState<string>("");
  const { publicKey, sendTransaction } = useWallet();
  // const connection = new Connection(`${process.env.NEXT_PUBLIC_HELIUS_URL}`, "confirmed");
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const setDripContract = async () => {
    const dripContract = getContract({
      address: params.address as `0x${string}`,
      abi: DripsABI,
      client: publicClient,
    });
    const productURL = await dripContract.read.dataURI();
    const previewImageURI = await dripContract.read.previewImageURI();
    setMetadataUrl(previewImageURI as string);
    if (productURL) {
      setShowContent(true);
      setProductDataURL(productURL as string);
      const metadataResponse = await fetch(`/api/fetch?url=${previewImageURI}`);
      const metadata = (await metadataResponse.json()) as {
        collectionAddress: string;
        dripCommunities: string[];
        name: string;
        description: string;
      };
      console.log(metadata);
      setCollectionAddress(metadata.collectionAddress);
      setDripCommunities(metadata.dripCommunities);
      setDescription(metadata.description);
      setName(metadata.name);
    }
  };

  const sendUSDCOnSOl = async () => {
    if (!publicKey) {
      return;
    }

    const devnet_usdc_pub_key = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
    const mainnet_usdc_pub_key = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

    const fromAta = await getAssociatedTokenAddress(devnet_usdc_pub_key, publicKey);

    console.log(fromAta.toBase58());

    const toAddress = new PublicKey("EBefTt9xXvoixAousPZSkYm78j71yKRWfrXwy7duw84L");

    const toAta = await getAssociatedTokenAddress(devnet_usdc_pub_key, toAddress);
    console.log(toAta.toBase58());

    let latestBlockhash = await connection.getLatestBlockhash();
    let tx = new Transaction().add(
      createTransferCheckedInstruction(
        fromAta, // from (should be a token account)
        devnet_usdc_pub_key, // mint
        toAta, // to (should be a token account)
        publicKey, // from's owner
        1e5, // amount, if your deciamls is 8, send 10^8 for 1 token
        6, // decimals
      ),
    );

    tx.recentBlockhash = latestBlockhash.blockhash;

    // Sign transaction
    tx.feePayer = publicKey;
    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction({ signature, ...latestBlockhash }, "confirmed");
    if (signature) {
      const nft = await createNFTOfCollection({
        collectionAddress: collectionAddress as MetaPlexPublicKey,
        newOwner: publicKey.toBase58() as MetaPlexPublicKey,
        metadataUrl: metadataUrl,
        name: name,
      });
      console.log(nft);
      if (nft) {
        toast.success("NFT created successfully");
      }
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
        {/* {showContent ? <h1>Content is available</h1> : <h1>Content is not available</h1>} */}
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
            <h1 className="w-[20rem] text-3xl font-title text-neutral-50">{name}</h1>
            <p className="w-[30rem] mt-2 font-primary text-neutral-400">{description}</p>
            <div className="flex flex-row gap-2 mt-4 items-center font-primary">
              <Image
                className="w-5 h-5"
                src={"/svgs/usdc.svg"}
                alt="product"
                width={200}
                height={200}
              />
              <p className="text-lg text-teal-400 font-medium">0.1</p>
            </div>
            <button
              onClick={sendUSDCOnSOl}
              className="w-[8rem] h-10 bg-gradient-to-r from-amber-300 to-amber-400 text-neutral-800 font-semibold rounded-lg mt-4"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
