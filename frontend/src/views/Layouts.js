import React, { useEffect } from "react";
import Logo from "./../img/top_logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { SideNav } from "../components/general";
import TopNav from "../components/general/TopNav";
const menuItems = [
  {
    title: "Home",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 "
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    path: "/",
  },
  // {
  //     title: 'administrators', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  //         <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  //     </svg>,
  //     path: '/administrators'
  // },
  {
    title: "Wahehouse",
    path: "/wahehouse",
  },
  {
    title: "Agents",
    path: "/agents",
  },

  {
    title: "Sellers",
    path: "/sellers",
  },
  {
    title: "packages",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
        />
      </svg>
    ),
    path: "/packages",
  },
  {
    title: "Riders",
    path: "/riders",
  },
  {
    title: "Collections",
    path: "/collections",
  },
  {
    title: "Switch Board",
    path: "/switch-board",
  },
  {
    title: "Rent a Shelf",
    path: "/rent-a-shelf",
  },
  {
    title: "Business",
    path: "/business",
  },
  {
    title: "setup",
    path: "/setup",
  },
  // {
  //     title: 'Payments', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  //         <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  //     </svg>,
  //     path: '/mpesa-payments'
  // }
];

function Layout(props) {
  const navigate = useNavigate();

  const logout = async () => {
    await localStorage.clear();
    return navigate("/");
  };
  useEffect(() => {
    var user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      return navigate("/");
    }
  });
  return (
    <div className="w-screen flex">
      <div className={"min-h-screen bg-black flex w-full"}>
        <SideNav
        //   isOpen={showSideBar} current={currentNav}
        />

        <Box
          minH={"full"}
          bg={"gray_bg"}
          w={"100%"}
          ml={0}
          className={"max-h-screen overflow-scroll"}
        >
          <TopNav
          //   toggleSideBar={handleToggle}
          />

          <div className="flex-1 py-2 px-4 bg-gray-200 overflow-scroll ">
            {props?.children}
          </div>
        </Box>
      </div>
    </div>
  );
}

export default Layout;
