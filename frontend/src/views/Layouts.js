import { Box, useMediaQuery } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SideNav } from "../components/general";
import MobileSideNav from "../components/general/MobileSideNav";
import TopNav from "../components/general/TopNav";

function Layout(props) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isLargerThan500] = useMediaQuery("(min-width:500px)");
  // const isMobile = useMemo(() => !isLargerThan500, [isLargerThan500]);

  useEffect(() => {
    if (isLargerThan500) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isLargerThan500]);

  const logout = async () => {
    if (window?.confirm("Are you sure you want to logout?")) {
      await localStorage.clear();
      return navigate("/");
    } else {
      return;
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
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
        {isLargerThan500 ? (
          <SideNav isOpen={isOpen} />
        ) : (
          <MobileSideNav isOpen={isOpen} hideSideBar={handleToggle} />
        )}

        <Box
          h={"100vh"}
          bg={"gray_bg"}
          w={"100%"}
          ml={0}
          className={"max-h-screen overflow-hidden"}
        >
          <TopNav toggleSideBar={handleToggle} handleLogout={logout} />

          <div className="flex-1 bg-gray-200 overflow-y-scroll min-h-[90vh] scrollbar-hide h-full relative ">
            {props?.children}
          </div>
        </Box>
      </div>
    </div>
  );
}

export default Layout;
