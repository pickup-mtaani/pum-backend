/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";

import { fetchWarehouseDroppedAgent } from "../../../redux/actions/agents.actions";
import { pickrehouse } from "../../../redux/actions/package.actions";
import Layout from "../../../views/Layouts";
import ConfirmModal from "../../confirm";
import Loader from "../../general/Loader";

// Rideagents
function PickPackage(props) {
  const location = useLocation();

  const [id, setId] = useState(null);
  const [show, setShow] = useState(false);
  const packAction = async (id, state, rider) => {
    await props.pickrehouse(id, state, rider);
    props.fetchWarehouseDroppedAgent(location?.state?.rider, "dropped");
  };

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
          <button
            className="bg-primary p-2 rounded-lg shadow"
            onClick={() => Recieve(row)}
          >
            Recieve
          </button>
        </>
      ),
    },
  ];

  // console.log("first", location.state)
  return (
    <Layout>
      <div className=" relative">
        <DataTable
          title={location?.state?.title}
          columns={Sellers_columns}
          data={props?.droppedAgent[location?.state?.agent]}
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
          handleClose={() => setShow(false)}
          Submit={async () => {
            await packAction(id, "recieved-warehouse", location?.state?.id);
            setShow(false);
          }}
        />

        <Loader isOpen={props?.loading} />
      </div>
    </Layout>
  );
}

const mapStateToProps = (state) => {
  return {
    droppedAgent: state.agentsData.warehouse?.agent,
    loading: state.agentsData.loading,
  };
};

export default connect(mapStateToProps, {
  fetchWarehouseDroppedAgent,
  pickrehouse,
})(PickPackage);
