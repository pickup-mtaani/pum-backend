import React, { useCallback, forwardRef, useEffect, useState, useRef } from 'react';
import { GoogleMapsProvider, useGoogleMap } from '@ubilabs/google-maps-react-hooks';


import { connect } from 'react-redux'
import { io } from 'socket.io-client'
import { get_riders, fetchpackages } from '../redux/actions/riders.actions'
import Layout from '../views/Layouts'
import DirectionsService from './googlemaps/directionService'
import MapMarkers from './googlemaps/mapMarkers';
import PIN from './Riders/pin.png'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
// import GoogleMapReact from 'google-map-react';
import { useLocation } from 'react-router-dom'
// import { GoogleMap } from 'react-google-maps/api';
const socket = io("https://stagingapi.pickupmtaani.com");


mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYXRlIiwiYSI6ImNqdWR0MjVsNzAxeTYzem1sb3FxaHhid28ifQ.ntUj7ZMNwUtKWaBUoUVuhw';



let start = {
    lat: "-1.33124", long: "36.88484 "
}
let stop = {
    lat: -1.145703, long: 36.964853
}

function Map(props) {
    const [lng, setLng] = useState(36.817223);
    const [lat, setLat] = useState(-1.286389);
    const [origin, setOrigin] = useState({ lat: -1.2878412, lng: 36.8278173 })
    const [destination, setDestination] = useState({ lat: -1.2850204, lng: 36.8259191 })
    const [rider, setrider] = useState("");
    const location = useLocation()
    const map = useGoogleMap()
    const markerRef = useRef()

    const defaultProps = {
        center: {
            lat: -1.286389,
            lng: 36.817223,
        },
        zoom: 16
    };

    // useEffect(() => {
    //     if (!map || markerRef.current) return;
    //     const options = {
    //         map
    //     };
    //     markerRef.current = new window.google.maps.Marker(options)
    // }, [map]);

    // useEffect(() => {
    //     if (!markerRef.current) return;
    //     markerRef.current.setPosition({
    //         lat: -1.286389,
    //         lng: 36.817223,

    //     })
    //     map.panTo({
    //         lat: -1.286389,
    //         lng: 36.817223,

    //     })
    // }, [map]);


    useEffect(() => {
        socket.on('connection');
        // console.log(location.state.id)
        socket.emit('track_rider', { rider_id: location.state.id, user_id: "1322" });
        // socket.on('position-change', data => {
        //     console.log('Position changed!!: ', data);
        // });
        socket.on('position-changed', coordinates => {
            console.log("E", coordinates.coordinates)
            setLng(coordinates.coordinates.longitude)
            setLat(coordinates.coordinates.latitude)
            let obj = { lat: coordinates.coordinates.latitude, lng: coordinates.coordinates.longitude }
            console.log(obj)
            setDestination(obj)
        });

        if (!markerRef.current) return;
        markerRef.current.setPosition({
            lat: -1.286389,
            lng: 36.817223,

        })
        map.panTo({
            lat: -1.286389,
            lng: 36.817223,

        })
    }, [socket])

    const [mapContainer, setMapContainer] = useState(null);
    const mapRef = useCallback(node => {
        node && setMapContainer(node);
    }, []);

    const mapOptions = {
        center: { lat: -1.286389, lng: 36.817223 },
        zoom: 13,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
            position: 3 // Right top
        }
    };

    return (
        <Layout>

            <GoogleMapsProvider
                googleMapsAPIKey="AIzaSyBBYlYdpbci4zBhCSyLAJngOBLR3cRCGJA"
                mapContainer={mapContainer}
                mapOptions={mapOptions}>
                <React.StrictMode>
                    <div ref={mapRef} style={{ height: '100%' }} />
                    <DirectionsService origin={origin} destination={destination} />
                    <MapMarkers origin={origin} destination={destination} />
                </React.StrictMode>
            </GoogleMapsProvider>
            {/* <div style={{ height: '100vh', width: '100%' }}> */}
            {/* <GoogleMap
                    id="circle-example"
                    mapContainerStyle={{
                        height: "400px",
                        width: "800px"
                    }}
                    zoom={7}
                    center={{
                        lat: -3.745,
                        lng: -38.523
                    }}
                /> */}


            {/* <GoogleMapReact
                    bootstrapURLKeys={{ key: "" }}
                    // bootstrapURLKeys={{ key: "AIzaSyBBYlYdpbci4zBhCSyLAJngOBLR3cRCGJA" }}
                    defaultCenter={{ lat, lng }}
                    defaultZoom={defaultProps.zoom}
                > */}
            {/* <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyBBYlYdpbci4zBhCSyLAJngOBLR3cRCGJA' }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                // yesIWantToUseGoogleMapApiInternals
                // onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                > */}
            {/* <AnyReactComponent
                        lat={lat}
                        lng={lng}
                        text="My Marker"
                    />

                </GoogleMapReact> */}
            {/* </div> */}

        </Layout>
    )
}

Map.propTypes = {}


const mapStateToProps = (state) => {
    return {

        riders: state.ridersDetails.riders,
        loading: state.ridersDetails.loading,

    };
};

export default connect(mapStateToProps, { get_riders, fetchpackages })(Map)

