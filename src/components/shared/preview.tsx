import Image from "next/image";
import React from "react";

const Preview = ({ content, type }: any) => {
  const renderPreview = () => {
    if (content) {
      if (type === "image") {
        return (
          <Image
            className="mx-auto min-w-[40rem] max-w-[50rem] max-h-[38rem] bg-gradient-to-tr from-teal-500 to-sky-400 rounded-lg"
            src={content}
            alt="Preview"
            width={200}
            height={200}
          />
        );
      } else if (type === "video") {
        return (
          <video
            className="mx-auto w-[40rem] h-[30rem] bg-gradient-to-tr from-teal-500 to-sky-400 rounded-lg object-fill"
            controls
            src={content}
          />
        );
      } else if (type === "pdf") {
        return (
          <iframe
            className="mx-auto w-[50rem] h-[38rem] bg-gradient-to-tr from-teal-500 to-sky-400 rounded-lg"
            src={content}
            title="Preview"
            width="400"
            height="300"
          ></iframe>
        );
      }
    }
    return (
      <Image
        className="mx-auto w-[14rem] h-[14rem] bg-gradient-to-tr from-teal-500 to-sky-400 rounded-lg object-fill"
        src={"/images/preview.png"}
        alt="Preview"
        width={200}
        height={200}
      />
    );
  };

  return <div>{renderPreview()}</div>;
};

export default Preview;
