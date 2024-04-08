"use client";
import { AddBtn, Card, StatsCard } from "@/components";
import { publicClient } from "@/config";
import { DripCasterABI, DripsABI } from "@/constant/abi";
import { dripCastContractAddress, statsData } from "@/constant";
import { FarcasterIcon } from "@/icons";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import Link from "next/link";

interface Products {
  name: string;
  price: string;
  supply: string;
  productAddress: string;
  image: string;
}

const Products: NextPage = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [totalSoldUnits, setTotalSoldUnits] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address } = useAccount();
  const readData = async () => {
    if (address) {
      setIsLoading(true);
      try {
        const productsData = await publicClient.readContract({
          address: dripCastContractAddress,
          abi: DripCasterABI,
          functionName: "getProducts",
          args: [address],
        });
        await fetchData(productsData);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
  };

  const fetchData = async (productsData: any) => {
    let products: Products[] = [];
    for (let product of productsData as any[]) {
      const imageUrl = await fetch(`/api/fetch?url=${product.previewImageURI}`);
      const image = await imageUrl.text();
      products.push({
        name: product.productName,
        price: formatEther(BigInt(product.price)),
        supply: product.supply.toString(),
        productAddress: product.productAddress,
        image: image,
      });
    }
    await soldUnits(products);
    setProducts(products as any);
    await revenueShare(products);
  };

  const soldUnits = async (products: Products[]) => {
    if (address) {
      try {
        let total = 0;
        for (let index = 0; index < products.length; index++) {
          const product = products[index];
          const soldUnits = await publicClient.readContract({
            address: product.productAddress as "0xString",
            abi: DripsABI,
            functionName: "soldUnits",
            args: [],
          });
          total += Number(soldUnits);
        }
        setTotalSoldUnits(total);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const revenueShare = async (products: Products[]) => {
    if (address) {
      try {
        let total = 0;
        for (let index = 0; index < products.length; index++) {
          const product = products[index];
          const revenue = await publicClient.readContract({
            address: product.productAddress as "0xString",
            abi: DripsABI,
            functionName: "revenueGenerated",
            args: [],
          });
          total += Number(formatEther(revenue as bigint));
        }
        setTotalRevenue(total);
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (address) {
      readData();
    }
  }, [address]);

  return (
    <div className="flex-1 w-full pt-40 pb-5 px-5 md:px-40 overflow-visible flex flex-col justify-start items-start">
      <div className="w-full flex flex-col justify-evenly items-center gap-8 relative">
        <div className="relative flex place-items-center before:absolute before:h-[50px] before:w-[180px] sm:before:h-[200px] md:before:w-[780px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[200px] sm:after:h-[180px] sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-teal-200 after:via-teal-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-teal-500 before:dark:opacity-10 after:dark:from-teal-400 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[260px] z-[-1]">
          <h1 className="text-5xl lg:text-6xl text-white font-title">Dashboard</h1>
        </div>
        {address ? (
          <>
            <div className="w-full flex flex-row justify-between items-center gap-3">
              <Link
                className="px-5 py-3 text-neutral-800 font-medium bg-gradient-to-tr from-sky-400 to-teal-400 hover:from-sky-500 hover:to-teal-500 rounded-lg"
                href="/withdraw"
              >
                Withdraw funds
              </Link>
              <AddBtn />
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 justify-evenly items-center gap-4">
              <StatsCard
                label={statsData[0].label}
                desc={statsData[0].desc}
                value={products.length}
              />
              <StatsCard
                label={statsData[1].label}
                desc={statsData[1].desc}
                value={totalSoldUnits}
              />
              <StatsCard label={statsData[2].label} desc={statsData[2].desc} value={totalRevenue} />
            </div>
            {isLoading ? (
              <div className="flex self-start justify-start">
                <div className="flex flex-col mt-5 w-fit bg-[#141414] bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl shadow-md p-6">
                  <div className="animate-pulse flex flex-col space-x-4">
                    <div className="rounded-xl bg-sky-400/20 h-48 w-[12rem]"></div>
                    <div className="block h-4 mt-5 self-start bg-gray-400/80 rounded w-3/4"></div>
                    <div className="flex flex-row items-center justify-between mt-2">
                      <div className="h-6 w-16 bg-gray-300/50 rounded"></div>
                      <div className="h-6 w-20 bg-amber-400/50 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8 self-start items-start justify-start">
                {products.length === 0 ? (
                  <p className="text-sky-400/80 text-lg">No products listed yet.</p>
                ) : (
                  products.map((product: any, index: any) => (
                    <Card
                      key={index}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      link={product.productAddress}
                      label={
                        <span className="flex flex-row gap-2">
                          Share on <FarcasterIcon className="w-6 h-6" />
                        </span>
                      }
                    />
                  ))
                )}
              </div>
            )}
          </>
        ) : (
          <h1 className="text-2xl font-primary text-amber-400">Please connect you wallet!</h1>
        )}
      </div>
    </div>
  );
};

export default Products;
