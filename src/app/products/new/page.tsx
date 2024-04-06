"use client";

import { NextPage } from "next";
import { Checkbox, Input, Search, Upload } from "@/components";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { parseUnits } from "viem";
import toast from "react-hot-toast";
import { podsABI, podsContractAddress } from "@/utils";

const collection = [
  {
    name: "Azuki Elementals",
    image: "https://gateway.pinata.cloud/ipfs/QmUNoWAZh1nS7nqN1n4B56S87hNwmdrcrSf9JZEV4Q69hC",
    address: "0x1234567890",
  },
  {
    name: "Becaon",
    image: "https://gateway.pinata.cloud/ipfs/QmUNoWAZh1nS7nqN1n4B56S87hNwmdrcrSf9JZEV4Q69hC",
    address: "0x1234567890",
  },
  {
    name: "James",
    image: "https://gateway.pinata.cloud/ipfs/QmUNoWAZh1nS7nqN1n4B56S87hNwmdrcrSf9JZEV4Q69hC",
    address: "0x1234567890",
  },
  {
    name: "Die hard",
    image: "https://gateway.pinata.cloud/ipfs/QmUNoWAZh1nS7nqN1n4B56S87hNwmdrcrSf9JZEV4Q69hC",
    address: "0x1234567890",
  },
  {
    name: "Zeo",
    image: "https://gateway.pinata.cloud/ipfs/QmUNoWAZh1nS7nqN1n4B56S87hNwmdrcrSf9JZEV4Q69hC",
    address: "0x1234567890",
  },
  {
    name: "Milano",
    image: "https://gateway.pinata.cloud/ipfs/QmUNoWAZh1nS7nqN1n4B56S87hNwmdrcrSf9JZEV4Q69hC",
    address: "0x1234567890",
  },
  {
    name: "Bored Ape",
    image: "https://gateway.pinata.cloud/ipfs/QmUNoWAZh1nS7nqN1n4B56S87hNwmdrcrSf9JZEV4Q69hC",
    address: "0x1234567890",
  },
  {
    name: "Madlad",
    image: "https://gateway.pinata.cloud/ipfs/QmUNoWAZh1nS7nqN1n4B56S87hNwmdrcrSf9JZEV4Q69hC",
    address: "0x1234567890",
  },
];

const CreateProduct: NextPage = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [productImage, setProductImage] = useState<string>("");
  const [contentImage, setContentImage] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [contentUrl, setContentUrl] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [supply, setSupply] = useState<number>(10);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedCards, setSelectedCards] = useState<
    { name: string; image: string; address: string }[]
  >([]);
  const [maxSupplyFlag, setMaxSupplyFlag] = useState<boolean>(false);
  const [isContentUploading, setIsContentUploading] = useState<boolean>(false);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { wallets } = useWallets();
  const { user } = usePrivy();

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
      image: imageUrl,
      description: description,
    };
    const res = await fetch("/api/json", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return `https://gateway.pinata.cloud/ipfs/${data.hash}`;
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
      setImageUrl(`https://gateway.pinata.cloud/ipfs/${cid.hash}`);
      console.log(isImageUploading);
      setIsImageUploading(false);
    } catch (error) {
      console.log(error);
      setIsImageUploading(false);
    }
  };

  const uploadContentImage = async (file: any) => {
    setIsContentUploading(true);
    const image = URL.createObjectURL(file);
    setContentImage(image);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      const cid = await res.json();
      setContentUrl(`https://gateway.pinata.cloud/ipfs/${cid.hash}`);
      setIsContentUploading(false);
    } catch (error) {
      console.log(error);
      setIsContentUploading(false);
    }
  };

  async function createGate(name: string, address: string) {
    const res = await fetch("/api/dynamic", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        outcome: "scope",
        rules: [
          {
            address: {
              contractAddress: address,
              networkId: 84532,
            },
            filter: {
              amount: 1,
            },
            type: "nft",
          },
        ],
        scope: "superuser",
      }),
    });
    const data = await res.json();
    toast.success("Token Gate created successfully", {
      icon: "🔑",
      style: {
        borderRadius: "10px",
      },
    });
  }

  async function getReputationScore(username: string) {
    const res = await fetch("/api/karma3", {
      method: "POST",
      body: JSON.stringify(username),
    });
    const data = await res.json();
    setScore(data?.score!);
  }

  async function createProduct(metadataURL: string) {
    if (score > 60) {
      setIsLoading(true);
      const wallet = wallets[0];
      const provider = await wallet.getEthersProvider();
      await wallet.switchChain(84532);
      const signer = provider.getSigner();
      const podsContract = new ethers.Contract(podsContractAddress, podsABI, signer);
      const amount = parseUnits(price.toString(), 18);
      const product = await podsContract.createProduct(
        wallet.address,
        name,
        imageUrl,
        metadataURL,
        amount,
        maxSupplyFlag,
        supply,
      );
      toast.success("Product Created Successfully", {
        icon: "🎉",
        style: {
          borderRadius: "10px",
        },
      });
      const contractAddress = await podsContract.getProducts(wallet.address);
      await createGate(name, contractAddress[contractAddress.length - 1].productAddress);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      getReputationScore(user.farcaster?.username!);
    }
  }, [user]);

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
                label="Upload Product"
                onChange={(e) => {
                  uploadProductImage(e.target.files[0]);
                }}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-5 mb-5">
              <Image
                className="mx-auto w-[14rem] h-[14rem] bg-gradient-to-bl from-teal-500 to-sky-400 rounded-lg object-fill"
                src={contentImage !== "" ? contentImage : "/images/preview.png"}
                alt="preview"
                width={200}
                height={200}
              />
              <Upload
                id="content"
                name="content"
                type="file"
                label="Upload Preview"
                onChange={(e) => {
                  uploadContentImage(e.target.files[0]);
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
          <button
            onClick={async (e) => {
              e.preventDefault();
              if (user) {
                const metadataURL = await uploadMetadata();
                createProduct(metadataURL);
              } else {
                toast.error("Please connect your farcaster to create a product", {
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
            collection={collection}
            selectedCards={selectedCards}
            onCardSelect={handleCardSelect}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
