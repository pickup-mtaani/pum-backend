import React, { useEffect } from "react";
import { connect } from "react-redux";
import { get_riders } from "../../redux/actions/riders.actions";
import Layout from "../../views/Layouts";
import { RiderItem } from "./AssignErrand";

const CollectDoorstep = (props) => {
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
          Collect Doorstep Packages from Rider
        </div>
        <div className="p-4 flex flex-wrap">
          {props?.riders?.map((rider) => (
            <RiderItem
              rider={rider}
              path={`/warehouse/doorstep/pick-packages-from/${rider?.user?.name.replace(
                /\s/g,
                ""
              )}`}
            />
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

export default connect(mapStateToProps, { get_riders })(CollectDoorstep);
