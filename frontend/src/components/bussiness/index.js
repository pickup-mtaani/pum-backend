import React, { useEffect, useState, useRef } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_business, activateShelf } from '../../redux/actions/bussiness.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
import AssignedPackModal from './AssignedPackModal'
import { Link } from 'react-router-dom'


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
  const [data1, setData] = React.useState([]);
  const [show, togglePopup] = useState();
  const [item, setItem] = useState([]);

  const onChangeFilter = (e) => {
    setFilterText(e)

  }

  const columns = [
    {
      sortable: true,
      name: ' Name',
      minWidth: '250px',
      selector: row => (
        <>{row.name}</>
      )
    },


    {
      sortable: true,
      name: 'Assign agent ',
      minWidth: '250px',
      selector: row => (
        <div onClick={() => props.activateShelf(row._id)}>
          Activate rent a shelf
        </div>
      )
    }

  ]

  const assignagentRider = async (e, id) => {

    await props.assignAgent(e.target.value, id)
    await props.get_business()
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
  const f = async () => {
    let r = await props.get_business()
    setData(r)
    console.log("Business", r)
  }
  useEffect(() => {
    f()


  }, [])

  return (
    <Layout>
      <div className=" mx-2 ">
        {/* <div ref={mapContainer} className="map-container my-2" style={{height: '400px'}} /> */}
        <DataTable
          title=" Riders"
          columns={columns}
          data={data1}
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

export default connect(mapStateToProps, { get_business, activateShelf })(Users)

