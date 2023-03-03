import React from "react";
import CSpinner from "./CSpinner";

const Loader = ({ isOpen, text = "Loading . . ." }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#00000050] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center ">
        <CSpinner />
        {/* spinner */}
        <br />
        {/* text */}
        <span className="text-lg font-bold text-primary">{text}</span>
      </div>
    </div>
  );
};

export default Loader;
