import React, { useEffect, useState } from 'react'
import Agent from './agent.switchboard'
import Rent from './rent.switchboard'
import Door from './door.switchboard'
import { connect } from 'react-redux'
import { get_rent_shelf_tracks, get_agent_tracks, get_door_step_tracks } from './../../../redux/actions/switchboard.actions'
import Layout from '../../../views/Layouts'
import { io } from 'socket.io-client'
const socket = io("http://localhost:4000/");
function Index(props) {
    const [view, setView] = useState('agent')
    useEffect(() => {
        props.get_rent_shelf_tracks()
        props.get_agent_tracks()
        props.get_door_step_tracks()
    }, [])
    useEffect(() => {
        socket.on('connection');
        socket.emit('seller-notification', { id: 200 })
        socket.on('change-state', data => {
            console.log(data)

        });


    }, [socket])

    return (
        <Layout>
            <div className='flex w-full justify-center'>
                <div className="flex justify-center items-center border p-2 w-1/3" onClick={() => setView("agent")}>Agent</div>
                <div className="flex justify-center items-center border p-2 w-1/3" onClick={async () => { setView("rent") }}>Rent  a Shelf</div>
                <div className="flex justify-center items-center border p-2 w-1/3" onClick={() => setView("door")}>Door Step</div>
            </div>
            <h3 style={{ textAlign: 'center', textTransform: 'uppercase', textDecoration: 'underline' }}>{view}'s SwitchBoard</h3>
            {view === "agent" ? <Agent data={props.agentTracks} /> : view === "rent" ? <Rent data={props.rentTracks} /> : <Door data={props.doorTacks} />}
            {/* {view === "rent" && <Rent />} */}
        </Layout>
    )
}


const mapStateToProps = (state) => {
    return {
        riders: state.ridersDetails.riders,
        packages: state.PackageDetails.packages,
        rentTracks: state.switchboard.shelf_packages_tracks,
        agentTracks: state.switchboard.agent_packages_tracks,
        doorTacks: state.switchboard.door_packages_tracks,
        loading: state.PackageDetails.indexloading,

    };
};

export default connect(mapStateToProps, { get_rent_shelf_tracks, get_door_step_tracks, get_agent_tracks })(Index)

