import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useLocation } from "react-router-dom";
import Layout from "../../../views/Layouts";
import { connect } from "react-redux";
import { get_riders } from "../../../redux/actions/riders.actions";
import {
  get_agents,
  get_zones,
  CollectDoorStep,
  assign,
  fetchrecieved,
  packstoassign,
  fetchAgentpack,
} from "../../../redux/actions/agents.actions";
import { assignwarehouse } from "../../../redux/actions/package.actions";
import ConfirmModal from "../../confirm";
import Loader from "../../general/Loader";
function Riderpage(props) {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [show, setShow] = useState(false);
  const [rider, setRider] = useState(null);
  const [id, setId] = useState(null);
  const fetch = async (rider, agent) => {
    let res = await props.packstoassign(rider, agent);
    setData(res);
  };
  useEffect(() => {
    console.log(location.state);
    fetch();
    fetch(location?.state?.rider, location?.state?.agent);
  }, []);
  const packAction = async (id, state, rider) => {
    await props.assignwarehouse(id, state, rider);
    await fetch();
    // let res = await props.fetchAgentpack(location?.state?.agent)
    // setData(res)
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
      name: "Receipt",
      minWidth: "250px",
      selector: (row) => row.receipt_no,
    },
    {
      sortable: true,
      name: "Business",
      minWidth: "250px",
      selector: (row) => row.businessId?.name,
    },
    {
      sortable: true,
      name: "Receiver Agent",
      minWidth: "250px",
      selector: (row) => row.receieverAgentID?.business_name,
    },
    {
      sortable: true,
      name: "Action",
      minWidth: "150px",
      selector: (row) => (
        <>
          {row.receieverAgentID?.rider ? (
            <button
              className=" p-2 bg-primary border shadow rounded"
              onClick={() => assign(row, row.receieverAgentID?.rider)}
            >
              {" "}
              Assign{" "}
            </button>
          ) : (
            <>Kindly assign {row.receieverAgentID.business_name} a rider</>
          )}
        </>
      ),
    },
  ];

  const assign = (row, id) => {
    console.log(id);
    setId(row._id);
    setRider(id);
    setShow(true);
  };

  return (
    <Layout>
      <ConfirmModal
        msg={`Assign this package `}
        show={show}
        handleClose={() => setShow(false)}
        Submit={async () => {
          await packAction(id, "assigned-warehouse", rider);
          await fetch(location?.state?.rider, location?.state?.agent);
          setShow(false);
        }}
      />
      <div className="">
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
      </div>
      {/* <ConfirmModal
                // showModal={setShowModal}
                // item={item}
                msg="Are you sure You want to Recieve this package"
                show={show}
              
                Submit={() => props.CollectDoorStep(id, "recieved-warehouse")}
            /> */}
      <Loader isOpen={props?.loading} />
    </Layout>
  );
}
const mapStateToProps = (state) => {
  return {
    agents: state.agentsData.agents,
    packages: state.agentsData.packs,
    loading: state.agentsData.loading,
    riders: state.ridersDetails.riders,
  };
};

export default connect(mapStateToProps, {
  get_agents,
  fetchrecieved,
  packstoassign,
  get_zones,
  assign,
  CollectDoorStep,
  get_riders,
  fetchAgentpack,
  assignwarehouse,
})(Riderpage);
