import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { useLoadScript } from '@react-google-maps/api'
import { connect } from 'react-redux'
import { io } from 'socket.io-client'
import { get_riders, fetchpackages } from '../redux/actions/riders.actions'
import Layout from '../views/Layouts'
import GoogleMap from './googlemaps/map'
const socket = io("https://stagingapi.pickupmtaani.com/");

function Map(props) {
    const location = useLocation()
    const [dest, setDest] = useState({ lat: -1.2850204, lng: 36.8259191 })
    const [pickUp, setPickUp] = useState({ lat: -1.2878412, lng: 36.8278173 })
    const [directions, setDirections] = useState();

    useEffect(() => {
        socket.on('connection');
        console.log(location.state.id)
        // socket.join('rider id')
        socket.emit('track_rider', { rider_id: location.state.id, user_id: "1322" });
        // socket.on('position-change', data => {
        //     console.log('Position changed!!: ', data);
        // });
        socket.on(`rider-${location.state.id}`, (data) => {
            const { coordinates: { latitude, longitude } } = data;
            if (!latitude || !longitude) return
            let obj = { lat: latitude, lng: longitude }
            // console.log(obj);
            setDest(obj)
            fetchDirections(obj)
        })
        socket.on('position-changed', coordinates => {
            console.log("E", coordinates.coordinates)
            // setLng(coordinates.coordinates.longitude)
            // setLat(coordinates.coordinates.latitude)
            let obj = { lat: coordinates.coordinates.latitude, lng: coordinates.coordinates.longitude }
            setDest(obj)
            fetchDirections(obj)
            // console.log(obj)
            // setDestination(obj)
        });

        socket.on('change-coord', data => {
            setDest(data)
            fetchDirections(data)
        });
        socket.on('change-stat', data => {
            console.log(data)
            // setDest(data)
            // fetchDirections(data)
        });
    }, [socket])

    useEffect(() => {
        const { lat, lng } = dest
        if (!lat || !lng) return
        fetchDirections(dest)
    }, [dest])

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyBBYlYdpbci4zBhCSyLAJngOBLR3cRCGJA',
        libraries: ["places"]
    })
    const fetchDirections = (position) => {
        if (!position) return;
        const service = new window.google.maps.DirectionsService();
        service.route(
            {
                origin: pickUp,
                destination: position,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK" && result) {
                    setDirections(result);
                }
            }
        );
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <Layout>
            <GoogleMap dest={dest} directions={directions} pickUp={pickUp} setDirections={setDirections} />
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

