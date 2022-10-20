import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { get_agents, get_zones, assign, fetchpackages, fetchdoorpackages } from '../../redux/actions/agents.actions'
import Layout from '../../views/Layouts'
import { DashboardWHItem, WHItem } from '../DashboardItems'
const Index = props => {
    const [collect, setCollections] = useState([])
    const [assign, setAssign] = useState([])
    const [agent, setAgent] = useState({ dropped: 0, transit: 0, recieved: 0 })
    const [doorStep, setDoorstep] = useState({ dropped: 0, transit: 0, recieved: 0 })

    const fetch = async () => {
        let agent_on_packages = await props.fetchpackages('on-transit')
        let agent_dropped_packages = await props.fetchpackages('dropped')
        let door_on_packages = await props.fetchdoorpackages('on-transit')
        let door_dropped_packages = await props.fetchdoorpackages('dropped')
        let recieved_dropped_packages = await props.fetchdoorpackages('recieved-warehouse')
        let recieved_agent_packages = await props.fetchpackages('recieved-warehouse')
        setAgent({ dropped: parseInt(agent_on_packages.length), transit: parseInt(agent_dropped_packages.length), recieved: parseInt(recieved_agent_packages.length) })
        setDoorstep({ dropped: parseInt(door_on_packages.length), transit: parseInt(door_dropped_packages.length), recieved: parseInt(recieved_dropped_packages.length) })
    }

    useEffect(() => {
        fetch()
    }, [])
    console.log(agent)
    return (
        <Layout>
            <div className='flex w-full gap-x-20 '>
                <WHItem noCount={false} obj={{ title: 'DOOR STEP PACKAGES', pathname: "/wahehouse/doorstep/packages", value: doorStep, state: "on-transit", data: collect }} />
                <WHItem noCount={false} obj={{ title: 'AGENT PACKAGES', pathname: "/wahehouse/agent-agent/packages", value: agent, state: "recieved-warehouse", data: collect }} />
            </div>
            {/* <div className='flex w-full gap-x-20 mt-20'>
                <DashboardWHItem obj={{ title: 'Collect Doorstep from Riders', value: doorStep.length, }} />
                <DashboardWHItem obj={{ title: 'Assign Doorstep to Riders', value: assignDoorstep.length, }} />
            </div> */}



        </Layout>
    )
}

const mapStateToProps = (state) => {
    return {

        agents: state.agentsData.agents,
        packages: state.agentsData.packs,
        loading: state.agentsData.loading,
        // error: state.userDetails.error,
    };
};

export default connect(mapStateToProps, { get_agents, get_zones, assign, fetchpackages, fetchdoorpackages })(Index)

