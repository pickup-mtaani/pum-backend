/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  assign,
  fetchdropped,
  fetchpackages,
  fetchWarehouseDroppedAgent,
  get_agents,
  get_zones,
  Rideagents,
} from "../../../redux/actions/agents.actions";
import { pickrehouse } from "../../../redux/actions/package.actions";
import Layout from "../../../views/Layouts";
import ConfirmModal from "../../confirm";
import { Dashboardagents } from "../../DashboardItems";
import Loader from "../../general/Loader";

// Rideagents
function Riderpage(props) {
  const location = useLocation();
  const [data, setData] = useState([]);

  const [id, setId] = useState(null);
  const [show, setShow] = useState(false);

  const packAction = async (id, state, rider) => {
    await props.pickrehouse(id, state, rider);
    setData(
      await props.fetchdropped(location?.state?.rider, location?.state?.agent)
    );
  };

  useEffect(() => {
    props.fetchWarehouseDroppedAgent(location?.state?.rider, "dropped");
  }, []);

  const Recieve = (row) => {
    setId(row._id);
    setShow(true);
  };

  const Sellers_columns = [
    {
      sortable: true,
      name: "Name",
      minWidth: "250px",
      selector: (row) => row.packageName,
    },
    {
      sortable: true,
      name: "Business",
      minWidth: "250px",
      selector: (row) => row.businessId?.name,
    },
    {
      sortable: true,
      name: "Action",
      minWidth: "150px",
      selector: (row) => (
        <>
          <button onClick={() => Recieve(row)}>Recieve package {}</button>
        </>
      ),
    },
  ];

  // console.log("first", location.state)
  return (
    <Layout>
      {Object.keys(props?.droppedAgent).length === 0 ? (
        <div className="h-16 w-full text-center font-bold text-lg flex items-center justify-center">
          List empty!
        </div>
      ) : (
        <>
          {location?.state?.title === "Collect From Riders" ? (
            <div className=" mx-2">
              <DataTable
                title={location?.state?.title}
                columns={Sellers_columns}
                data={data}
                pagination
                paginationServer
                // progressPending={props.loading}
                // paginationResetDefaultPage={resetPaginationToggle}
                subHeader
                // subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
                // onChangePage={handlePageChange}
                // paginationTotalRows={totalRows}
                // onChangeRowsPerPage={handlePerRowsChange}
              />
              <ConfirmModal
                msg=" Recieve this package"
                show={show}
                Submit={async () => {
                  await packAction(
                    id,
                    "recieved-warehouse",
                    location?.state?.id
                  );
                  setShow(false);
                  fetch("dropped", location?.state?.agent);
                }}
              />
            </div>
          ) : (
            <>
              <div className="w-full p-2 flex flex-wrap ">
                {Object.keys(props?.droppedAgent)?.map((key, i) => (
                  <Dashboardagents
                    name={
                      props?.droppedAgent[key][0]?.senderAgentID?.business_name
                    }
                    path={`/warehouse/agent/pick-packages-from-rider/${props?.droppedAgent[
                      key
                    ][0]?.senderAgentID?.business_name.replace(/\s/g, "")}`}
                    count={props?.droppedAgent[key]?.length}
                    rider={location?.state?.rider}
                    agent={props?.droppedAgent[key][0]?.senderAgentID}
                    title={"Collect From Riders"}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      <Loader isOpen={props?.loading} />
    </Layout>
  );
}
const mapStateToProps = (state) => {
  return {
    agents: state.agentsData.agents,
    packages: state.agentsData.packs,
    loading: state.agentsData.loading,
    droppedAgent: state.agentsData.warehouse?.agent,
  };
};

export default connect(mapStateToProps, {
  get_agents,
  get_zones,
  Rideagents,
  assign,
  fetchpackages,
  fetchdropped,
  fetchWarehouseDroppedAgent,
  pickrehouse,
})(Riderpage);
