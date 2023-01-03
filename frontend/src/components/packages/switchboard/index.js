import React, { useEffect, useState } from 'react'
import Agent from './agent.switchboard'
import Rent from './rent.switchboard'
import Door from './door.switchboard'
import { connect } from 'react-redux'
import { get_rent_shelf_tracks, get_agent_tracks, get_door_step_tracks } from './../../../redux/actions/switchboard.actions'
import Layout from '../../../views/Layouts'
import { get_agents, } from '../../../redux/actions/agents.actions'

import { io } from 'socket.io-client'
import moment from 'moment'
const socket = io(process.env.REACT_APP_BASE_URL);
function Index(props) {
    const [view, setView] = useState('agent')
    const [agent_id, setAgent] = useState('')
    const fetch = async () => {
        await props.get_agent_tracks()
        await props.get_agents()
    }
    useEffect(() => {
        fetch()
    }, [])
    // useEffect(() => {
    //     socket.on('connection');
    //     socket.emit('seller-notification', { id: 200 })
    //     socket.on('change-state', data => {
    //         console.log(data)

    //     });


    // }, [socket])
    // console.log(props.agents[10].s)
    return (
        <Layout>

            <div className='bg-slate-200 w-full text-center text-bold text-2xl uppercase'>
                <h1>SwicthBoard {moment().format('YY - MM - DD')}</h1>
            </div><div className='bg-slate-200 w-full mt-3'>
                <div className='w-1/3'>
                    <select className='h-8 w-full' onChange={(e) => setAgent(e.target.value)}>
                        <option value=''>all</option>
                        {props?.agents?.map((agent, i) => (
                            <option key={i} value={agent._id} >{agent.business_name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='w-full p-2 flex flex-wrap border-b border-slate-400 gap-x-1'>
                <div className='md:w-1/4 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center'
                    onClick={async () => { await props.get_agent_tracks(); setView("agent") }} style={{ backgroundColor: view === "agent" && "gray" }} >
                    Agents to Agent {view === "agent"}
                </div>

                <div className='md:w-1/4 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center'
                    onClick={async () => { await props.get_rent_shelf_tracks(); setView("rent") }} style={{ backgroundColor: view === "rent" && "gray" }} >
                    Rent A Shelf {view === "rent"}
                </div>
                <div className='md:w-1/4 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center'
                    onClick={async () => { await props.get_door_step_tracks(); setView("door") }} style={{ backgroundColor: view === "door" && "gray" }} >
                    Door Step {view === "door"}
                </div>

            </div>

            <h3 style={{ textAlign: 'center', textTransform: 'uppercase', textDecoration: 'underline' }}>{view}'s SwitchBoard</h3>
            {view === "agent" ? <Agent data={props.agentTracks} agent={agent_id} /> : view === "rent" ? <Rent data={props.rentTracks} agent={agent_id} /> : <Door data={props.doorTacks} agent={agent_id} />}

        </Layout>
    )
}


const mapStateToProps = (state) => {
    return {
        riders: state.ridersDetails.riders,
        agents: state.agentsData.agents,
        packages: state.PackageDetails.packages,
        rentTracks: state.switchboard.shelf_packages_tracks,
        agentTracks: state.switchboard.agent_packages_tracks,
        doorTacks: state.switchboard.door_packages_tracks,
        loading: state.PackageDetails.indexloading,

    };
};

export default connect(mapStateToProps, { get_rent_shelf_tracks, get_agents, get_door_step_tracks, get_agent_tracks })(Index)

