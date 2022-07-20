import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
const socket = io("localhost:4000");
function AssignRider() {

    const [position, setPosition] = useState({
        latitude: '',
        longitude: ''
    })
    const [user, setUser] = useState({}
    )
    const getCurent = async () => {
        socket.on('current-user', async (data) => {

            setUser(data)

        })
    }
    useEffect(() => {
        // getCurent()

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function (position) {
                console.log('changing position')
                console.log("Latitude is :", position.coords.latitude);
                console.log("Longitude is :", position.coords.longitude);
            });
        }
        navigator.geolocation.getCurrentPosition(function (position) {
            user.coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
            socket.on('position-change', async (user) => {
                // setPosition(data)
                // console.log(user)
            })
        });



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
        </div>
    )
}

export default AssignRider