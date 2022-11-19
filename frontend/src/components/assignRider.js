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

        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
    }, [lat, lng])
    return (
        <Layout>
            <div className=" mx-2 ">
                <div ref={mapContainer} className="map-container my-2" style={{ height: '400px' }} />
                {/* <div ref={mapContainer} className="map-container" /> */}
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
                    // offsetLeft={-20}
                    // offsetTop={-20}
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

