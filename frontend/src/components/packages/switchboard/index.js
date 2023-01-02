import React, { useEffect, useState } from 'react'
import Agent from './agent.switchboard'
import Rent from './rent.switchboard'
import Door from './door.switchboard'
import { connect } from 'react-redux'
import { get_rent_shelf_tracks, get_agent_tracks, get_door_step_tracks } from './../../../redux/actions/switchboard.actions'
import Layout from '../../../views/Layouts'
import { io } from 'socket.io-client'
const socket = io(process.env.REACT_APP_BASE_URL);
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


            <div className='w-full p-2 flex flex-wrap border-b border-slate-400 gap-x-1'>
                <div className='md:w-1/4 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center' onClick={() => setView("agent")} style={{ backgroundColor: view === "agent" && "gray" }} >
                    Agents to Agent {view === "agent"}
                </div>

                <div className='md:w-1/4 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center' onClick={async () => { setView("rent") }} style={{ backgroundColor: view === "rent" && "gray" }} >
                    Rent A Shelf {view === "rent"}
                </div>
                <div className='md:w-1/4 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center' onClick={async () => { setView("door") }} style={{ backgroundColor: view === "door" && "gray" }} >
                    Door Step {view === "door"}
                </div>

            </div>
            {/* <div className="flex justify-center items-center border p-2 w-1/3" onClick={() => setView("agent")}>Agent</div>
                <div className="flex justify-center items-center border p-2 w-1/3" onClick={async () => { setView("rent") }}>Rent  a Shelf</div>
                <div className="flex justify-center items-center border p-2 w-1/3" onClick={() => setView("door")}>Door Step</div> */}

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

