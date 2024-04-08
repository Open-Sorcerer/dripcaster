import React from "react";

export const Spinner = () => {
  return (
    <div className="inline-block h-5 w-5 animate-[spin_0.7s_linear_infinite] rounded-full border-2 border-b-transparent border-l-transparent">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
