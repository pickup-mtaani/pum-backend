import React, { useEffect, useState, useRef } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { io } from 'socket.io-client'
import { get_riders, fetchpackages } from '../redux/actions/riders.actions'
import Search_filter_component from './common/Search_filter_component'
import Layout from '../views/Layouts'
import ReactMapGl, { Marker, Popup } from 'react-map-gl';
import PIN from './Riders/pin.png'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import AssignedPackModal from './Riders/AssignedPackModal'
import { DownloadFile } from './common/helperFunctions'
const socket = io("http://localhost:4000/");

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
    const [zoom, setZoom] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [data, setFilterData] = React.useState([]);
    const [show, togglePopup] = useState();
    const [item, setItem] = useState([]);



    useEffect(() => {
        // props.get_riders({ limit: 10 })
        socket.on('connection');

        socket.emit('track_rider', { rider_id: '6350c6baa64f05136a209d07', user_id: "1322" });

        socket.on('position-change', data => {
            console.log('Position changed!!: ', data);
        });

        socket.on('position-changed', async coordinates => {

            // console.log('coordinates', coordinates.coordinates);
            setLng(coordinates.coordinates.longitude)
            setLat(coordinates.coordinates.latitude)
        });






    }, [])
    return (
        <Layout>
            <div className=" mx-2 h-[1000px] w-[100%]">
                {/* <div ref={mapContainer} className="map-container my-2" style={{height: '400px'}} /> */}

                <ReactMapGl
                    {...viewPoints}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    zoom={zoom}
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
                        latitude={lat}
                        longitude={lng}
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

export default connect(mapStateToProps, { get_riders, fetchpackages })(Users)

