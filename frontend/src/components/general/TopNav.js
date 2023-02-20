import { Box, HStack } from "@chakra-ui/react";
import React from "react";

import { BiMenuAltLeft } from "react-icons/bi";
import { BsBell } from "react-icons/bs";
// import Avatar from "./general/Avatar";

const TopNav = ({ toggleSideBar, handleLogout }) => {
  return (
    <div className="sticky bg-black z-10 h-[60px] top-0 right-0 bottom-0 flex justify-between items-center w-full">
      <button
        className={
          "hover:bg-zinc-100 p-1.5 rounded-full focus:outline-none mx-2 text-white"
        }
        onClick={toggleSideBar}
      >
        <BiMenuAltLeft className="text-2xl" />
      </button>

      <span className="font-bold text-md text-white">ADMIN PANEL</span>

      {/* nav items */}
      <HStack px={"3"} gap={"1"}>
        <button
          className={
            "hover:bg-zinc-100 p-2 rounded-full focus:outline-none relative text-white"
          }
        >
          <BsBell className="text-xl" />

          {/* <Badge /> */}
        </button>

        <button
          className={
            " px-2 py-1 sm focus:bg-gray-800 bg-black relative font-semibold text-white border border-white"
          }
          onClick={handleLogout}
        >
          Logout
          {/* <Badge /> */}
        </button>
      </HStack>
    </div>
  );
};

export default TopNav;

export const Badge = () => (
  <Box
    bg={"primary_red"}
    borderRadius={"full"}
    position={"absolute"}
    top={"1"}
    right={"2"}
    h={"3"}
    w={"3"}
    borderWidth={"2px"}
    borderColor={"white"}
  />
);
