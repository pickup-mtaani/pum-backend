import React from "react";

import { BsBookshelf, BsPeople } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import {
  MdOutlineDashboard,
  MdOutlineDirectionsCar,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import SideNavItem, { SideNavCollapse } from "./SideNavItem";
import { TbBuildingWarehouse } from "react-icons/tb";
import { HiOutlineUsers, HiOutlineViewBoards } from "react-icons/hi";
import { GoPackage } from "react-icons/go";
import { IoBusinessOutline } from "react-icons/io5";
import { RiEBike2Line } from "react-icons/ri";
import { FaMoneyBill } from "react-icons/fa";
// import Finance from "../assets/svg/Finance";

const SideNav = ({ current = "dashboard", isOpen = true }) => {
  const dispatch = useDispatch();

  return (
    <div
      className={`bg-black max-h-screen relative flex-shrink-0 ${
        isOpen ? "w-[230px]" : "w-20"
      } duration-300`}
    >
      <div className="sticky right-0 top-0 left-0 bottom-0 flex flex-col px-0.5 py-2 ">
        {/* logo */}
        <div className="flex justify-center py-8 ">
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
              <Link key={i} to={"" + nav?.path}>
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

export default SideNav;

let nav_list = [
  {
    name: "Home",
    icon: <AiOutlineHome />,
    path: "/",
  },
  {
    name: "Warehouse",
    path: "/warehouse",
    icon: <TbBuildingWarehouse />,
  },

  {
    name: "Users",
    path: "",
    icon: <HiOutlineUsers />,
    isExpandable: true,
    options: [
      { path: "/sellers", name: "Sellers" },
      { path: "/agents", name: "Agents" },
      { path: "/riders", name: "Riders" },
    ],
  },

  {
    name: "packages",
    path: "/packages",
    icon: <GoPackage />,
  },
  {
    name: "Collections",
    path: "/collections",
    icon: <GoPackage />,
  },
  {
    name: "Switch Board",
    path: "/switch-board",
    icon: <HiOutlineViewBoards />,
  },
  {
    name: "Mpesa",
    path: "/mpesa",
    icon: <FaMoneyBill />,
    isExpandable: true,
    options: [{ path: "/mpesa/withdrawals", name: "Withdraw" }],
  },
  {
    name: "Rent a Shelf",
    path: "/rent-a-shelf",
    icon: <BsBookshelf />,
  },
  {
    name: "Business",
    path: "/business",
    icon: <IoBusinessOutline />,
  },
  {
    name: "setup",
    path: "/setup",
  },
];
