import React, { useEffect, useState } from "react";
import WarehouseServices from "../../services/WarehouseServices";
import Layout from "../../views/Layouts";
import { WHItem } from "../DashboardItems";
const Index = () => {
  const [errand, setErrand] = useState();
  const [agent, setAgent] = useState({ dropped: 0, transit: 0, recieved: 0 });
  const [doorstep, setDoorstep] = useState({
    dropped: 0,
    transit: 0,
    recieved: 0,
  });
  const [unpicked, setUnpicked] = useState(0);

  const fetchPackagesCount = async () => {
    try {
      const count = await WarehouseServices.getWarehouseCount();
      setAgent(count?.agent);
      setDoorstep(count?.doorstep);
      setErrand(count?.errand);
      setUnpicked(
        parseInt(
          count?.errand?.unpicked +
            count?.doorstep?.unpicked +
            count?.agent?.unpicked
        )
      );
      console.log(count);
    } catch (error) {
      console.log("FETCH WAREHOUSE PACKAGES ERROR: ", error);
    }
  };

  useEffect(() => {
    fetchPackagesCount();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col w-full p-4 md:p-8 lg:p-12 gap-2 md:gap-8 mb-12 ">
        {/* Agent packages row */}
        <div className="md:flex gap-8 justify-between">
          <WHItem
            noCount={false}
            obj={{
              title: "Collect Agent Packages",
              pathname: "/warehouse/agent/collect",
              value: agent?.collect,
              state: "on-transit",
            }}
            type={"from"}
          />
          <WHItem
            noCount={false}
            obj={{
              title: "Assign Agent Packages",
              pathname: "/warehouse/agent/assign",
              value: agent?.assign,

              state: "recieved-warehouse",
            }}
            type={"to"}
          />
        </div>

        {/* Errand packages row */}
        <div className="md:flex gap-8 justify-between">
          <WHItem
            noCount={false}
            obj={{
              title: "COLLECT DOORSTEP PACKAGES",
              pathname: "/warehouse/doorstep/collect",
              value: doorstep?.collect,

              state: "on-transit",
            }}
            type={"from"}
          />
          <WHItem
            noCount={false}
            obj={{
              title: "ASSIGN DOORSTEP PACKAGES",
              pathname: "/warehouse/doorstep/assign",
              value: doorstep?.assign,

              state: "recieved-warehouse",
            }}
            type={"to"}
          />
        </div>

        <div className="md:flex gap-8 justify-between">
          <WHItem
            noCount={false}
            obj={{
              title: "Collect Errand riders",
              pathname: "/warehouse/errand/collect",
              value: errand?.collect,
              state: "on-transit",
            }}
            type={"from"}
          />
          <WHItem
            noCount={false}
            obj={{
              title: "Assign Errand riders",
              pathname: "/warehouse/errand/assign",
              value: errand?.assign,
              state: "recieved-warehouse",
            }}
            type={"to"}
          />
        </div>

        <div className="md:flex gap-8 justify-center">
          <WHItem
            noCount={false}
            obj={{
              title: "Unpicked",
              pathname: "/warehouse/doorstep/packages",
              value: unpicked,
              state: "on-transit",
            }}
            type={"unpicked packages"}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
