import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_agents, get_zones, assign, fetchpackages } from '../../redux/actions/agents.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
import moment from 'moment'
import { Link } from 'react-router-dom'
// const socket = io("3.23.185.115:4000");
function Payments(props) {

  const columns = [
    {
      sortable: true,
      name: 'Name',
      minWidth: '10px',

      selector: row =>
      (<>
        <Link to={`/agent/${row?.user?.name.replace(/\s/g, '')}`}>{row.user?.name}</Link>
      </>)

    },
    {
      sortable: true,
      name: 'Phone number',
      minWidth: '10px',

      selector: row => row.user?.phone_number
    },
    {
      sortable: true,
      name: 'location',
      minWidth: '100px',
      wrap: true,
      selector: row => row.loc?.name
    },
    // {
    //   sortable: true,
    //   name: 'Zone',

    //   maxWidth: '50px',
    //   selector: row => (<>{row.zone ? row.zone?.name : "Not  assigned  a Zone"}</>)
    // },
    {
      sortable: true,
      name: 'Date Paid',

      selector: row => (
        <div style={{ display: 'flex' }} className="gap-2">
          {props.zones.map((zone, i) => (
            <div key={i} style={{
              height: 20,
              background: zone?._id === row.zone?._id ? 'red' : "blue",
              color: 'white',
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              justifyItems: 'center'

            }} onClick={async () => { await props.assign(row._id, zone._id); await props.get_agents() }}>{zone.name}</div>
          ))}
        </div>
      ),
    },

  ]

  const [searchValue, setSearchValue] = useState("")

  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);
  const [showModal, setShowModal] = useState(false);
  const [Mpesadata, setMData] = useState([]);

  const onChangeFilter = (e) => {

  }
  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <>
        <Search_filter_component
          onChangeFilter={onChangeFilter}

          searchValue={searchValue}

          showModal={showModal}
          download={() => DownloadFile(() =>
            props.FetchAdmins({ limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_users`
          )}
        />


      </>
    );
  }, [searchValue, showModal]);

  useEffect(() => {
    props.get_agents()
    props.get_zones()

  }, [])

  console.log(props.zones)
  return (
    <Layout>
      <div className=" mx-2">
        <DataTable
          // title=" Agent to Agent Delivery"
          columns={columns}
          data={props.agents}
          pagination
          paginationServer
          progressPending={props.loading}
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
          // onChangePage={handlePageChange}
          paginationTotalRows={totalRows}
        // onChangeRowsPerPage={handlePerRowsChange}
        />
      </div>



    </Layout>
  )
}


const mapStateToProps = (state) => {
  return {

    agents: state.agentsData.agents,
    zones: state.agentsData.zones,
    loading: state.agentsData.loading,
    // error: state.userDetails.error,
  };
};

export default connect(mapStateToProps, { get_agents, get_zones, assign, fetchpackages })(Payments)

