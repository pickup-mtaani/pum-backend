import React, { useEffect } from "react";
import { connect } from "react-redux";
import Layout from "../../views/Layouts";
import { get_riders } from "../../redux/actions/riders.actions";
import { MdDeliveryDining } from "react-icons/md";
import { Link } from "react-router-dom";

const AssignErrand = (props) => {
  const fetch = async () => {
    await props.get_riders();
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout>
      <div className="m-8 bg-white rounded pb-12">
        {/* title */}
        <div className="p-3 border-b-2 border-b-blue-500 font-semibold text-xl text-center">
          Assign Errand Packages to Rider
        </div>
        <div className="p-4 flex flex-wrap">
          {props?.riders?.map((rider) => (
            <RiderItem rider={rider} path={`/wahehouse/errand/assign-rider`} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    riders: state.ridersDetails.riders,
  };
};

export default connect(mapStateToProps, { get_riders })(AssignErrand);

export const RiderItem = ({ rider, path, title }) => (
  <div className="md:w-[45%] w-full bg-gray-200 rounded-xl m-5">
    <Link
      to={{
        pathname: path,
      }}
      state={{
        rider: rider?.user?._id,
        title: title,
      }}
      as={"div"}
      className={
        "w-full h-full flex flex-col justify-center items-center gap-4 p-5  mx-auto"
      }
    >
      {/* icon */}
      <MdDeliveryDining className={"text-cyan-600 text-4xl "} />

      <p className="text-lg font-semibold">{rider?.user?.name}</p>
    </Link>
  </div>
);
