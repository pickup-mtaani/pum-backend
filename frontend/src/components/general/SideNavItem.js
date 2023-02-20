import React, { useState } from "react";
import { BiCaretDown } from "react-icons/bi";
import { Link } from "react-router-dom";

const SideNavItem = ({ isCurrent, icon, name, isOpen, className, ...rest }) => {
  return (
    // <Tooltip label={name} aria-label="A tooltip">
    // <>
    //   {isCollapsible ? (
    <li
      className={`flex my-1 mx-1 cursor-pointer gap-2 text-sm uppercase px-2 py-3 bg-primary hover:bg-white hover:text-black items-center ${
        isCurrent
          ? "font-[600] text-white bg-current_bg"
          : "font-[700] text-black"
      } ${!isOpen && "justify-center h-10 w-10 mx-auto"} ${className}`}
      {...rest}
    >
      <div className={`${isOpen ? "text-lg" : "text-lg"}`}>{icon} </div>

      <span className={`truncate duration-300 ${!isOpen && " hidden -z-2"}`}>
        {name}
      </span>
    </li>
    //   ) : (
    //     <SideNavCollapse />
    //   )}
    // </>
    // </Tooltip>
  );
};

export const SideNavCollapse = ({ isCurrent, icon, name, isOpen, options }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    // <Tooltip label={name} aria-label="A tooltip">
    <>
      <li
        className={`flex my-1 mx-1 cursor-pointer gap-2 text-sm uppercase px-2 py-3 hover:bg-white hover:text-black items-center ${
          isCurrent
            ? "font-[600] text-white bg-current_bg"
            : "font-[700] text-black"
        } ${!isOpen && "justify-center h-10 w-10 mx-auto"} ${
          isExpanded ? "bg-white" : " bg-primary"
        } `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`${isOpen ? "text-lg" : "text-lg"}`}>{icon} </div>

        <div
          className={`truncate flex-1 duration-300 ${
            !isOpen && " hidden -z-2"
          }`}
        >
          {name}
        </div>
        <div>
          <BiCaretDown
            className={`duration-300 text-lg ${
              isExpanded ? "rotate-180" : "-rotate-[180]"
            }`}
          />
        </div>
      </li>

      <div
        className={` text-white mx-1 duration-300 ${
          !isExpanded ? "hidden" : "block"
        }`}
      >
        {options?.map((nav, i) => (
          <Link key={i} to={"" + nav?.path}>
            <SideNavItem
              // isCurrent={current === nav?.path}

              className={"h-9"}
              name={nav?.name}
              isOpen={isOpen}
            />
          </Link>
        ))}
      </div>
    </>
    // </Tooltip>
  );
};

export default SideNavItem;
