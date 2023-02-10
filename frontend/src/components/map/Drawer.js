import { HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsArrowRight, BsPersonCircle, BsSearch } from "react-icons/bs";
import { connect } from "react-redux";

const Drawer = ({ riders, coordinates, handleHide, isOpen, handlePan }) => {
  const [searchRiders, setSearchRiders] = useState(riders);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let result = riders?.filter((r) =>
      r?.name?.toLowerCase()?.includes(search)
    );
    setSearchRiders(result);
  }, [riders, search]);

  return (
    <div
      className={`h-[90vh] absolute right-1 z-20  top-[60px] bottom-0  bg-slate-50 overflow-y-scroll duration-300 ${
        isOpen ? "w-[250px]" : "w-0"
      }`}
    >
      <div className={"bg-white shadow px-2 py-3 top-0 sticky left-0 right-0"}>
        <HStack justifyContent={"space-between"} alignItems={"center"}>
          <span className="text-md font-semibold mb-2">Riders</span>

          <button className="p-2 hover:outline-none" onClick={handleHide}>
            <BsArrowRight />
          </button>
        </HStack>
        <div className="flex gap-2 rounded-full border-gray-500 border items-center overflow-hidden">
          <BsSearch className={"text-sm ml-2 shrink-0"} />
          <input
            className="flex-1 h-8 focus:outline-none text-sm"
            placeholder="phone number"
            onChange={(e) => setSearch(e?.target?.value)}
          />
        </div>
      </div>
      <div className="px-2">
        {searchRiders?.map((rider) => (
          <RiderItem
            name={rider?.name}
            handleClick={() =>
              handlePan(
                coordinates[rider?._id][0]?.lat,
                coordinates[rider?._id][0]?.lng,
                rider?._id
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

const RiderItem = ({ name, handleClick }) => (
  <HStack
    className="py-3 px-1 gap-2 m-1 border-b border-gray-400 hover:bg-slate-200 cursor-pointer "
    onClick={handleClick}
  >
    {/* header */}

    <BsPersonCircle className={"text-2xl text-gray-500"} />

    <span className="text-sm text-slate-800">{name}</span>
  </HStack>
);

const mapStateToProps = (state) => ({
  riders: state.userDetails.riders,
  coordinates: state.tracker.coordinates,
});

export default connect(mapStateToProps)(Drawer);
