import React from "react";
import { IoClose } from "react-icons/io5";

import { Link } from "react-router-dom";
import { nav_list } from "./SideNav";
import SideNavItem, { SideNavCollapse } from "./SideNavItem";
// import Finance from "../assets/svg/Finance";

const MobileSideNav = ({
  current = "dashboard",
  isOpen = true,
  hideSideBar,
}) => {
  return (
    <div
      className={`bg-[#00000080] max-h-screen z-20 flex-shrink-0 ${
        isOpen ? "w-screen" : "w-0"
      } duration-300
      
      absolute md:fixed overflow-scroll scrollbar-hide right-0 top-0 left-0 bottom-0
      `}
    >
      <div className="bg-black flex flex-col px-0.5 py-2 w-[230px] ">
        {/* logo */}
        <div className="flex justify-center py-8 sticky top-0 left-0 bg-black z-20 ">
          <button
            className={
              " p-1.5 rounded-full focus:outline-none mx-2 text-white absolute top-0 -right-2"
            }
            onClick={hideSideBar}
          >
            <IoClose className="text-3xl" />
          </button>

          <div className="font-bold text-lg text-white underline">
            PICKUP MTAANI
          </div>
        </div>
        <ul className="flex flex-col flex-[0.9] overflow-y-scroll no-scrollbar ">
          {nav_list?.map((nav, i) =>
            nav?.isExpandable ? (
              <SideNavCollapse
                name={nav?.name}
                icon={nav?.icon}
                isOpen={isOpen}
                options={nav?.options}
              />
            ) : (
              <Link
                key={i}
                to={"" + nav?.path}
                onClick={() => {
                  console.log("CLICKED");
                }}
              >
                <SideNavItem
                  isCurrent={current === nav?.path}
                  name={nav?.name}
                  icon={nav?.icon}
                  isOpen={isOpen}
                />
              </Link>
            )
          )}
        </ul>
        {/* <LogoutButton handleClick={handleLogout} isOpen={isOpen} /> */}
      </div>
    </div>
  );
};

export default MobileSideNav;
