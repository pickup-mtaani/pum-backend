import React, { useEffect, useState, useRef } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_riders } from '../../redux/actions/riders.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
import ReactMapGl, { Marker, Popup } from 'react-map-gl';
import PIN from './pin.png'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax


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
      minWidth: '250px',
      selector: row => row.rider_name
    },

    {
      sortable: true,
      name: 'Phone number',
      minWidth: '250px',
      selector: row => row.rider_phone_number
    },
    {
      sortable: true,
      name: 'ID',
      minWidth: '250px',
      selector: row => row.rider_ID_number
    },
    {
      sortable: true,
      name: 'Rate',
      minWidth: '225px',
      selector: row => row.delivery_rate
    },
    {
      sortable: true,
      name: 'Charge Per KM',
      minWidth: '250px',
      selector: row => row.charger_per_km
    },
  ]



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
        {/* <div ref={mapContainer} className="map-container my-2" style={{height: '400px'}} /> */}
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
        <ReactMapGl
          {...viewPoints}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onViewPortsChange={(viewPoints) => setViewPoints(viewPoints)}
          mapboxAccessToken="pk.eyJ1Ijoia2VuYXRlIiwiYSI6ImNqdWR0MjVsNzAxeTYzem1sb3FxaHhid28ifQ.ntUj7ZMNwUtKWaBUoUVuhw"
        >
          {show && <Popup
            latitude={lat}
            longitude={lng}
            closeButton={true}
            onClose={() => togglePopup(false)}
            anchor="top-right"
          >
            <div>{popupMark.location}</div>
          </Popup>
          }
          <Marker
            latitude="-1.28824"
            longitude="36.81404"
            offsetLeft={-20}
            offsetTop={-20}
          >

            <img
              style={{ cursor: 'pointer', height: 20, width: 40 }}
              onclick={() => {
                setlocapopup({
                  latitude: { lat },
                  longitude: { lng },
                  location: "Nairobi"
                })
                togglePopup(true);
              }}
              src={PIN}
            />
          </Marker>
          <Marker
            latitude={lat}
            longitude={lng}
            offsetLeft={-20}
            offsetTop={-20}
          >
            <img
              style={{ cursor: 'pointer', height: 20, width: 40, objectFit: 'cover' }}

              src={PIN}
            />
          </Marker>

        </ReactMapGl>
      </div>



    </Layout>
  )
}

Users.propTypes = {}


const mapStateToProps = (state) => {
  return {

    riders: state.ridersDetails.riders,
    loading: state.ridersDetails.loading,

  };
};

export default connect(mapStateToProps, { get_riders })(Users)

