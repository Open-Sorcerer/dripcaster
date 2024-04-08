"use client";
import Image from "next/image";
import React from "react";

interface Card {
  name: string;
  price: number;
  image: string;
  label: React.ReactElement;
  link: string;
}

const Card = ({ name, price, image, label, link }: Card) => {
  return (
    <div className="flex flex-col w-fit bg-[#141414] bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-xl shadow-md p-6">
      <Image
        src={
          image === ""
            ? "https://gateway.pinata.cloud/ipfs/QmUNoWAZh1nS7nqN1n4B56S87hNwmdrcrSf9JZEV4Q69hC"
            : image
        }
        loader={({ src }) => src}
        alt={name}
        width={200}
        height={200}
        className="object-fill bg-amber-400 w-[14rem] h-[14rem] rounded-xl"
      />
      <h2 className="text-xl text-teal-400 font-primary font-medium truncate mt-3">{name}</h2>
      <span className="flex flex-row justify-between items-center">
        <p className="text-gray-300 font-primary font-normal">{price} ETH</p>
        <button
          onClick={() =>
            window.open(
              `https://warpcast.com/~/compose?embeds[]=https://dripcast.vercel.app/frames?address=${link}`,
              "_blank",
            )
          }
          className="bg-gradient-to-br from-[#ffd84b] from-[20%] to-[#b67e2b] hover:from-[#ffd643] hover:from-[20%] hover:to-[#c18d40] font-primary font-medium items-center rounded-lg px-5 py-1.5 cursor-pointer"
        >
          {label}
        </button>
      </span>
    </div>
  );
};

export default Card;
