import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SideNav } from "../components/general";
import TopNav from "../components/general/TopNav";

function Layout(props) {
  const navigate = useNavigate();

  const _logout = async () => {
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
          h={"100vh"}
          bg={"gray_bg"}
          w={"100%"}
          ml={0}
          className={"max-h-screen overflow-hidden"}
        >
          <TopNav
          //   toggleSideBar={handleToggle}
          />

          <div className="flex-1 bg-gray-200 overflow-y-scroll min-h-[90vh] scrollbar-hide h-full">
            {props?.children}
          </div>
        </Box>
      </div>
    </div>
  );
}

export default Layout;
