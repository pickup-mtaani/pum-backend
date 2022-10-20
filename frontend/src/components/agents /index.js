import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_agents, get_zones, assign, fetchpackages } from '../../redux/actions/agents.actions'
import { get_riders, } from '../../redux/actions/riders.actions'
import { get_routes } from '../../redux/actions/routes.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
import moment from 'moment'
import { Link } from 'react-router-dom'
// const socket = io("https://stagingapi.pickupmtaani.com");
function Agents(props) {


  const [rider, setRider] = useState('')
  const assigRider = () => {

  }
  const columns = [
    {
      sortable: true,
      name: 'Name',
      minWidth: '10px',

      selector: row =>
      (<>
        <Link
          to={{
            pathname: `/agent/${row?.user?.name.replace(/\s/g, '')}`
          }}
          state={{
            agent: row?.user?.name,
            id: row?.user?._id,
          }}
        >{row.user?.name}
        </Link>
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
      selector: row => row.location_id?.name
    },
    // {
    //   sortable: true,
    //   name: 'Rider',

    //   maxWidth: '50px',
    //   selector: row => (<>{row.rider }</>)
    // },
    {
      sortable: true,
      name: 'Assign Rider',

      selector: row => (
        <div style={{ display: 'flex' }} className="gap-2">
          <select name="gender" onChange={(event) => props.assign(event?.target?.value, row._id)} className="bg-transparent border-b border-slate-500 pt-5 pb-5 ">
            <option value=""> Select Rider</option>
            {props.riders?.map((rider, i) => (
              <option key={i} value={rider.user?._id} >{rider?.user?.name}</option>
            ))}

          </select>

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

  const fetch = async () => {
    await props.get_agents()
    await props.get_riders()
  }
  useEffect(() => {

    fetch()

  }, [])

  console.log(props.riders)
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
    riders: state.ridersDetails.riders,
    loading: state.agentsData.loading,
    // error: state.userDetails.error,
  };
};

export default connect(mapStateToProps, { get_agents, get_riders, get_routes, get_zones, assign, fetchpackages })(Agents)

