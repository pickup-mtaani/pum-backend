import React from "react";

const Tooltip = ({ text }) => {
  return (
    <div className="flex w-full p-24">
      <div className="relative">
        <div className="bg-primary shadow-md border-gray-700 border-2 text-gray-600 rounded flex  justify-center text-xs py-3 font-bold w-12 h-10 ">
          {text}
        </div>

        <div className="w-4 h-4 absolute -bottom-2 left-[16px] bg-primary border-gray-700 border-r-2 border-b-2 b rotate-45" />
      </div>
    </div>
  );
};

export default Tooltip;
