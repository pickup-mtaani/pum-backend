import React, { useEffect, useState, useRef } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { io } from 'socket.io-client'
import { get_riders, fetchpackages } from '../redux/actions/riders.actions'
import Search_filter_component from './common/Search_filter_component'
import Layout from '../views/Layouts'
import ReactMapGl, { Marker, Popup } from 'react-map-gl';
import PIN from './Riders/pin.png'
import { useLocation } from 'react-router-dom'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import AssignedPackModal from './Riders/AssignedPackModal'
import { DownloadFile } from './common/helperFunctions'
const socket = io("https://stagingapi.pickupmtaani.com/");


mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYXRlIiwiYSI6ImNqdWR0MjVsNzAxeTYzem1sb3FxaHhid28ifQ.ntUj7ZMNwUtKWaBUoUVuhw';
function Users(props) {


    const [viewPoints, setViewPoints] = useState({
        width: "100vh", height: "800px", latitude: -1.286389, longitude: 36.817223, zoom: 16
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
    const location = useLocation()
    const onChangeFilter = (e) => {
        setFilterText(e)

    }

    const fetchUserPackages = async (row) => {
        setShowModal(true);
        setItem(row)
        let result = await props.fetchpackages(row._id)
        setFilterData(result)
    }

    const columns = [
        {
            sortable: true,
            name: ' Name',
            minWidth: '250px',
            selector: row => row.user.name
        },

        {
            sortable: true,
            name: 'Phone number',
            minWidth: '250px',
            selector: row => row.user.phone_number
        },
        {
            sortable: true,
            name: 'ID',
            minWidth: '250px',
            selector: row => row.id_number
        },
        {
            sortable: true,
            name: 'Bikes Reg No',
            minWidth: '250px',
            selector: row => row.bike_reg_plate
        },
        {
            sortable: true,
            name: 'Rate',
            minWidth: '225px',
            selector: row => row.delivery_rate ? row.delivery_rate : 200
        },
        {
            sortable: true,
            name: 'Charge Per KM',
            minWidth: '250px',
            selector: row => row.charger_per_km ? row.charger_per_km : 120
        },
        {
            sortable: true,
            name: 'My packages',
            minWidth: '150px',
            selector: row => <>
                <button onClick={() => fetchUserPackages(row)}>Packages </button>
            </>
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

        socket.on('connection');

        // socket.emit('track_rider', { rider_id: '', user_id: "1322" });
        socket.emit('track_rider', { rider_id: location.state.id, user_id: "1322" });
        socket.on('user-joined', data => {
            console.log('user joined!', data);
        });

        socket.on('get-users', data => {
            console.log('Get users:', data);
        });

        // getCurrentLocation();
        // socket.emit('position-change', {coordinates: crd});

        socket.on('position-changed', async d => {
            console.log('coordinates', d.coordinates);
            setLng(d.coordinates.longitude)
            setLat(d.coordinates.latitude)
        });


        // getCurent()

        // if (navigator.geolocation) {
        //     navigator.geolocation.watchPosition(function (position) {
        //         console.log('changing position')
        //         console.log("Latitude is :", position.coords.latitude);
        //         console.log("Longitude is :", position.coords.longitude);
        //     });
        // }
        // navigator.geolocation.getCurrentPosition(function (position) {
        //     user.coords = {
        //         latitude: position.coords.latitude,
        //         longitude: position.coords.longitude
        //     }
        //     socket.on('position-change', async (user) => {
        //         setPosition(user)
        //         // console.log(user)
        //     })
        // });



    }, [lat])
    return (
        <Layout>
            <div className=" mx-2 ">
                <div ref={mapContainer} className="map-container my-2" style={{ height: '400px' }} />
                {/* <DataTable
                    title=" Riders"
                    columns={columns}
                    data={[]}
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
                /> */}
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
                    {/* <Marker
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
                    </Marker> */}
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

        riders: state.ridersDetails.riders,
        loading: state.ridersDetails.loading,

    };
};

export default connect(mapStateToProps, { get_riders, fetchpackages })(Users)

