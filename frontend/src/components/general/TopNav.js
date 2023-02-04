import { Box, HStack, Text } from "@chakra-ui/react";
import React from "react";

import { BiMenuAltLeft } from "react-icons/bi";
import { BsBell } from "react-icons/bs";
// import Avatar from "./general/Avatar";

const TopNav = ({ toggleSideBar, user }) => {
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

      {/* nav items */}
      <HStack px={"3"} gap={"1"}>
        <button
          className={
            "hover:bg-zinc-100 p-2 rounded-full focus:outline-none relative"
          }
        >
          <BsBell className="text-xl" />

          <Badge />
        </button>

        <HStack gap={"0.5"}>
          {/* <Avatar text={"A"} /> */}

          <Text className={"text-sm"} color={"white"} fontWeight={"bold"}>
            Admin
          </Text>
        </HStack>
      </HStack>
    </div>
  );
};

export default TopNav;

const Badge = () => (
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
