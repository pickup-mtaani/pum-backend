import { Button } from "@chakra-ui/react";
import React from "react";
import { AiOutlineMenuUnfold } from "react-icons/ai";

const SideBarBtn = ({handleClick}) => {
  return (
    <button
      className={"rounded-full p-3 shadow-md absolute top-20 right-2 z-10 h-10 w-10 bg-yellow-400 text-black cursor-pointer"}
      onClick={handleClick}
    >
      <AiOutlineMenuUnfold className="text-xl" />
    </button>
  );
};

export default SideBarBtn;
