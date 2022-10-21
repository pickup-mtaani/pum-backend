import React, { useEffect, useState } from 'react'

import { connect } from 'react-redux'
import { io } from 'socket.io-client'
import { get_riders, fetchpackages } from '../redux/actions/riders.actions'
import Layout from '../views/Layouts'
import PIN from './Riders/pin.png'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import GoogleMapReact from 'google-map-react';
import { useLocation } from 'react-router-dom'
const socket = io("https://stagingapi.pickupmtaani.com/dashboard/");


mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYXRlIiwiYSI6ImNqdWR0MjVsNzAxeTYzem1sb3FxaHhid28ifQ.ntUj7ZMNwUtKWaBUoUVuhw';

const AnyReactComponent = ({ lat, lng }) => <div>
    <img src={PIN} alt=""
        style={{ cursor: 'pointer', height: 20, width: 40 }}
        onclick={() => {
            // setlocapopup({
            //     latitude: { lat },
            //     longitude: { lng },
            //     location: "Nairobi"
            // })
            // togglePopup(true);
        }}
    />
</div>;

function Users(props) {
    const [lng, setLng] = useState(36.817223);
    const [lat, setLat] = useState(-1.286389);
    const [rider, setrider] = useState("");
    const location = useLocation()

    const defaultProps = {
        center: {
            lat: -1.286389,
            lng: 36.817223,

        },
        zoom: 16
    };

    useEffect(() => {

        socket.on('connection');

        socket.emit('track_rider', { rider_id: location.state.id, user_id: "1322" });

        socket.on('position-change', data => {
            console.log('Position changed!!: ', data);
        });

        socket.on('position-changed', coordinates => {
            console.log(coordinates.coordinates)
            setLng(coordinates.coordinates.longitude)
            setLat(coordinates.coordinates.latitude)
        });






    }, [])

    return (
        <Layout>


            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "" }}
                    // bootstrapURLKeys={{ key: "AIzaSyBBYlYdpbci4zBhCSyLAJngOBLR3cRCGJA" }}
                    defaultCenter={{ lat, lng }}
                    defaultZoom={defaultProps.zoom}
                >
                    {/* <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyBBYlYdpbci4zBhCSyLAJngOBLR3cRCGJA' }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                // yesIWantToUseGoogleMapApiInternals
                // onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                > */}
                    <AnyReactComponent
                        lat={lat}
                        lng={lng}
                        text="My Marker"
                    />

                </GoogleMapReact>
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

