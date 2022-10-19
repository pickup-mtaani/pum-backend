import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
const socket = io("http://localhost:4000/");
mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYXRlIiwiYSI6ImNqdWR0MjVsNzAxeTYzem1sb3FxaHhid28ifQ.ntUj7ZMNwUtKWaBUoUVuhw';


function AssignRider() {
    const [viewPoints, setViewPoints] = useState({
        width: "100vh", height: "800px", latitude: -1.286389, longitude: 36.817223, zoom: 12
    })
    const [position, setPosition] = useState({
        accuracy: 15.140000343322754,
        altitude: 1610.4000244140625,
        heading: 0,
        latitude: -1.301465,
        longitude: 36.8894634,
        speed: 0
    })

    const [user, setUser] = useState({}
    )
    const getCurent = async () => {
        socket.on('current-user', async (data) => {

            setUser(data)

        })
    }
    useEffect(() => {
        socket.on('connection');
        socket.emit('track_rider', { rider_id: '632181644f413c3816858218', user_id: "1322" });

        socket.on('user-joined', data => {
            console.log('user joined!', data);
        });

        socket.on('get-users', data => {
            console.log('Get users:', data);
        });

        // getCurrentLocation();
        // socket.emit('position-change', {coordinates: crd});

        socket.on('position-changed', async d => {
            console.log('coordinates', d);
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



    })

    const onAssign = () => {
        let pos = {}
        navigator.geolocation.getCurrentPosition(function (position) {
            setPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
            socket.emit("start-ride", {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        });

    }

    return (
        <div>

            <button onClick={onAssign}>Kenn</button>

            <ReactMapGl
                {...viewPoints}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onViewPortsChange={(viewPoints) => setViewPoints(viewPoints)}
                mapboxAccessToken="pk.eyJ1Ijoia2VuYXRlIiwiYSI6ImNqdWR0MjVsNzAxeTYzem1sb3FxaHhid28ifQ.ntUj7ZMNwUtKWaBUoUVuhw"
            >
                {show && <Popup
                    latitude={position.latitude}
                    longitude={position.longitude}
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
                                latitude: position.latitude,
                                longitude: position.longitude,
                                location: "Nairobi"
                            })
                            togglePopup(true);
                        }}
                        src={PIN}
                    />
                </Marker>
                <Marker
                    latitude={position.latitude}
                    longitude={position.longitude}
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
    )
}

export default AssignRider