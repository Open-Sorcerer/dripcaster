import { UploadIcon } from "@/icons";
import React from "react";

interface IUpload {
  id: string;
  name: string;
  type?: string;
  accept?: string;
  label: string;
  onChange: (e: any) => void;
}

const Upload = ({ id, name, type, accept, label, onChange }: IUpload) => {
  return (
    <div className="flex flex-col font-primary">
      <button className="p-0 w-[180px] d-block h-[40px] relative rounded-[10px] text-black bg-gray-200 border border-gray-200 hover:bg-gray-300 font-bold overflow-hidden hover:cursor-pointer">
        <div className="relative h-full flex items-center font-medium justify-center">
          <UploadIcon className="w-4 h-4 text-neutral-700 mr-2" /> {label}
        </div>
        <input
          id={id}
          name={name}
          type={type || "file"}
          className="absolute opacity-0 left-0 top-0 bottom-0 right-0 hover:cursor-pointer z-10"
          onChange={onChange}
          required
        />
      </button>
    </div>
  );
};

export default Upload;
