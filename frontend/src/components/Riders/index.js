import React, { useEffect, useState, useRef } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_riders, fetchpackages, assignAgent } from '../../redux/actions/riders.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import AssignedPackModal from './AssignedPackModal'
import { get_agents } from '../../redux/actions/agents.actions'
import { Link } from 'react-router-dom'

mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYXRlIiwiYSI6ImNqdWR0MjVsNzAxeTYzem1sb3FxaHhid28ifQ.ntUj7ZMNwUtKWaBUoUVuhw';
function Users(props) {


  const [viewPoints, setViewPoints] = useState({
    width: "100vh", height: "800px", latitude: -1.286389, longitude: 36.817223, zoom: 12
  })
  const [filterText, setFilterText] = React.useState('');
  const [searchValue, setSearchValue] = useState("")
  const [date, setDate] = useState("")
  const [popupMark, setlocapopup] = useState({

  })
  const [showModal, setShowModal] = useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(36.817223);
  const [lat, setLat] = useState(-1.286389);
  const [zoom, setZoom] = useState(9);
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);
  const [show, togglePopup] = useState();
  const [item, setItem] = useState([]);

  const onChangeFilter = (e) => {
    setFilterText(e)

  }

  const columns = [
    {
      sortable: true,
      name: ' Name',
      selector: row => (<Link
        to={{
          pathname: `/track/${row?.user?.name.replace(/\s/g, '')}`,
        }}
        state={{
          id: row?.user?._id
        }}>
        {row.user?.name}
      </Link>
      )
    },

    {
      sortable: true,
      name: 'Phone number',
      wrap: true,
      selector: row => row.user?.phone_number
    },

    {
      sortable: true,
      name: 'Bikes Reg No',
      wrap: true,
      selector: row => row.bike_reg_plate
    },



    // {
    //   sortable: true,
    //   name: 'Assign agent ',
    //   selector: row => (
    //     <>
    //       <select name="current_custodian" onChange={(e) => assignagentRider(e, row._id)} className="my-2">
    //         <option>Select an agent </option>
    //         {props.agents.map((loc, i) => (
    //           <option value={loc?.user?._id}>{loc.user?.name}</option>
    //         ))}
    //         {/* agent_location */}
    //       </select>
    //     </>
    //   )
    // }
    // {
    //   sortable: true,
    //   name: 'My packages',
    //   minWidth: '150px',
    //   selector: row => <>
    //     <button onClick={() => fetchUserPackages(row)}>Packages </button>
    //   </>
    // },
  ]

  const assignagentRider = async (e, id) => {

    await props.assignAgent(e.target.value, id)
    await props.get_riders()
  }

  const subHeaderComponentMemo = React.useMemo(() => {

    return (
      <>
        <Search_filter_component
          onChangeFilter={onChangeFilter}

          searchValue={searchValue}
          date={date}
          download={() => DownloadFile(() =>
            props.FetchAdmins({ date, limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_users`
          )}
        />


      </>
    );
  }, [searchValue, date,]);

  useEffect(() => {
    props.get_riders({ limit: 10 })
    props.get_agents()
    // if (map.current) return; // initialize map only once
    // map.current = new mapboxgl.Map({
    //   container: mapContainer.current,
    //   style: 'mapbox://styles/mapbox/streets-v11',
    //   center: [lng, lat],
    //   zoom: zoom
    // });
  }, [])

  return (
    <Layout>
      <div className=" mx-2 ">

        <DataTable
          title=" Riders"
          columns={columns}
          data={props.riders}
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

      <AssignedPackModal
        show={showModal}
        data={data}
        riders={props.riders}
        // changeInput={(e) => changeInput(e)}
        // submit={() => submit()}
        toggle={() => setShowModal(false)}
      />


    </Layout>
  )
}

Users.propTypes = {}


const mapStateToProps = (state) => {
  return {
    agents: state.agentsData.agents,
    riders: state.ridersDetails.riders,
    loading: state.ridersDetails.loading,

  };
};

export default connect(mapStateToProps, { get_riders, get_agents, assignAgent, fetchpackages })(Users)

