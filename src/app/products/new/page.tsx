"use client";

import { NextPage } from "next";
import { Checkbox, Input, ContentPreview, Search, Upload } from "@/components";
import Image from "next/image";
import { useState } from "react";
import { Abi, parseUnits } from "viem";
import toast from "react-hot-toast";
import { useAccount, useWriteContract } from "wagmi";
import { dripCastContractAddress } from "@/constant";
import { DripCasterABI } from "@/constant/abi";
import { dripData } from "@/constant/dripData";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-base";

const CreateProduct: NextPage = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [productImage, setProductImage] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [contentUrl, setContentUrl] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [supply, setSupply] = useState<number>(10);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [registerOnSolana, setRegisterOnSolana] = useState<boolean>(false);
  const [selectedCards, setSelectedCards] = useState<
    { name: string; image: string; address: string }[]
  >([]);
  const [maxSupplyFlag, setMaxSupplyFlag] = useState<boolean>(false);
  const [isContentUploading, setIsContentUploading] = useState<boolean>(false);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address } = useAccount();
  const { select, wallets, publicKey, disconnect, connected, connect, wallet } = useWallet();

  const { data, writeContractAsync, status, error } = useWriteContract();

  const handleCardSelect = (card: any) => {
    const isSelected = selectedCards.some((selectedCard) => selectedCard.name === card.name);

    if (isSelected) {
      setSelectedCards(selectedCards.filter((selectedCard) => selectedCard.name !== card.name));
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const uploadMetadata = async () => {
    const body = {
      name: name,
      image: contentUrl,
      description: description,
      dripAddresses: selectedCards.map((card) => card.address),
    };
    const res = await fetch("/api/json", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return `https://ipfs.moralis.io:2053/ipfs/${data.hash}`;
  };

  const uploadProductImage = async (file: any) => {
    setIsImageUploading(true);
    const image = URL.createObjectURL(file);
    setProductImage(image);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      const cid = await res.json();
      setImageUrl(`https://ipfs.moralis.io:2053/ipfs/${cid.hash}`);
      setIsImageUploading(false);
    } catch (error) {
      console.log(error);
      setIsImageUploading(false);
    }
  };

  const uploadContent = async (file: any) => {
    setIsContentUploading(true);
    setContent(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      const cid = await res.json();
      setContentUrl(`https://ipfs.moralis.io:2053/ipfs/${cid.hash}`);
      setIsContentUploading(false);
    } catch (error) {
      console.log(error);
      setIsContentUploading(false);
    }
  };

  async function createProduct(metadataURL: string) {
    setIsLoading(true);
    const amount = parseUnits(price.toString(), 18);
    await writeContractAsync({
      account: address,
      address: dripCastContractAddress,
      abi: DripCasterABI as Abi,
      functionName: "createDrip",
      args: [
        address,
        name,
        imageUrl,
        metadataURL,
        amount,
        maxSupplyFlag,
        supply,
        selectedCards.map((card) => card.address),
      ],
    });
    toast.success("Product Created Successfully", {
      icon: "🎉",
      style: {
        borderRadius: "10px",
      },
    });
    setIsLoading(false);
  }

  return (
    <div className="flex-1 w-full pt-40 pb-10 px-5 md:px-40 flex flex-col justify-start items-start">
      <div className="w-full flex flex-col justify-evenly items-center gap-8 relative">
        <div className="relative flex place-items-center before:absolute before:h-[50px] before:w-[180px] sm:before:h-[200px] md:before:w-[780px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[200px] sm:after:h-[180px] sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-teal-200 after:via-teal-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-teal-500 before:dark:opacity-10 after:dark:from-teal-400 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[260px] z-[-1]">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-title">
            What&apos;s brewing in your creative cauldron?
          </h1>
        </div>
        <form className="flex flex-col space-y-5 w-[90%] md:max-w-[600px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10">
            <div className="flex flex-col items-center justify-center gap-5 mb-5">
              <Image
                className="mx-auto w-[14rem] h-[14rem] bg-gradient-to-tr from-teal-500 to-sky-400 rounded-lg object-fill"
                src={productImage !== "" ? productImage : "/images/preview.png"}
                alt="preview"
                width={200}
                height={200}
              />
              <Upload
                id="image"
                name="image"
                type="file"
                label="Upload Preview"
                onChange={(e) => {
                  uploadProductImage(e.target.files[0]);
                }}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-5 mb-5">
              <ContentPreview content={content} />
              <Upload
                id="content"
                name="content"
                type="file"
                label="Upload File"
                onChange={(e) => {
                  uploadContent(e.target.files[0]);
                }}
              />
            </div>
          </div>
          <Input
            id="name"
            name="name"
            label="Name"
            placeholder="Azuki Elementals"
            type="text"
            onChange={(e) => setName(e.target.value)}
            helper="This Can Be Your Product Name or Unique Vibe"
          />
          <Input
            id="description"
            name="description"
            label="Description"
            placeholder="This is official Azuki community product."
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            helper="This Can Be Your Brief Description or Product Tagline"
          />
          <Checkbox
            id="maxSupplyFlag"
            name="maxSupplyFlag"
            label="Set Max Supply (Optional)"
            onChange={(e) => setMaxSupplyFlag(e.target.checked)}
          />
          {maxSupplyFlag && (
            <Input
              id="supply"
              name="supply"
              label="Max Supply"
              placeholder="0"
              type="number"
              onChange={(e) => setSupply(e.target.value)}
            />
          )}
          <Search
            onClick={() => {
              setShowDialog(!showDialog);
            }}
            selectedCards={selectedCards}
          />
          <Input
            id="price"
            name="price"
            label="Price"
            placeholder="0.05"
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            helper="Recommend to set product price (in ETH)"
          />
          <span className="flex flex-col md:flex-row justify-between">
            <Checkbox
              id="registerOnSolana"
              name="registerOnSolana"
              label="Register on Solana"
              onChange={(e) => setRegisterOnSolana(e.target.checked)}
            />
            {registerOnSolana && (
              <button
                className="w-[20rem] text-neutral-100 hover:text-neutral-50 bg-gradient-to-tr from-teal-500 to-violet-500 hover:from-teal-400 hover:to-violet-600 rounded-lg px-5 py-2.5 text-center truncate font-medium shadow"
                onClick={async (e) => {
                  e.preventDefault();
                  if (!connected) {
                    const availableWallets = wallets.map((wallet) => wallet.adapter.name);
                    if (availableWallets.includes("Backpack" as WalletName)) {
                      select("Backpack" as WalletName);
                    } else if (availableWallets.includes("Phantom" as WalletName)) {
                      select("Phantom" as WalletName);
                    } else {
                      toast.error("Please install Phantom or Backpack wallet to connect", {
                        icon: "🔒",
                        style: {
                          borderRadius: "10px",
                        },
                      });
                    }
                    await wallet?.adapter.connect();
                  } else {
                    await disconnect();
                  }
                }}
              >
                {connected ? `${publicKey?.toBase58()}` : "Connect your SOL Wallet"}
              </button>
            )}
          </span>
          <button
            onClick={async (e) => {
              e.preventDefault();
              if (address) {
                const metadataURL = await uploadMetadata();
                createProduct(metadataURL);
              } else {
                toast.error("Please connect your wallet to create a product", {
                  icon: "🔒",
                  style: {
                    borderRadius: "10px",
                  },
                });
              }
            }}
            className="w-full text-neutral-900 hover:text-neutral-800 bg-gradient-to-tr from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 rounded-lg px-5 py-2.5 text-center font-medium shadow disabled:opacity-75 disabled:cursor-progress"
            disabled={isImageUploading || isContentUploading || isLoading}
          >
            {isImageUploading || isContentUploading
              ? "Uploading Image..."
              : isLoading
                ? "Getting your product ready..."
                : "Add product 🚀"}
          </button>
          <Search.Dialog
            isEnabled={showDialog}
            setOutsideClick={setShowDialog}
            collection={dripData}
            selectedCards={selectedCards}
            onCardSelect={handleCardSelect}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
