"use client";
import Image from "next/image";
import React from "react";

interface DripCard {
  name: string;
  image: string;
  address: string;
  isSelected: boolean;
  onSelect: () => void;
}

const DripCard = ({ name, image, address, isSelected, onSelect }: DripCard) => {
  return (
    <div
      className={`flex flex-col w-[10rem] bg-[#141414] bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-xl shadow-md p-3 cursor-pointer ${isSelected ? "border border-amber-400" : ""}`}
      onClick={onSelect}
    >
      <Image
        src={
          image === ""
            ? "https://gateway.pinata.cloud/ipfs/QmUNoWAZh1nS7nqN1n4B56S87hNwmdrcrSf9JZEV4Q69hC"
            : image
        }
        alt={name}
        width={200}
        height={200}
        className="object-fill bg-sky-400/50 w-[10rem] h-[8rem] rounded-xl"
      />
      <h2 className="text-sm text-teal-500 font-primary font-medium truncate mt-3">{name}</h2>
    </div>
  );
};

export default DripCard;
