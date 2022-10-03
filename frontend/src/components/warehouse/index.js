import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { get_agents, get_zones, assign, fetchpackages } from '../../redux/actions/agents.actions'
import Layout from '../../views/Layouts'
import { DashboardWHItem } from '../DashboardItems'
const Index = props => {
    const [collect, setCollections] = useState([])
    const [assign, setAssign] = useState([])
    const [doorStep, setDoorstep] = useState([])
    const [assignDoorstep, setAssignDoorStep] = useState([])
    const fetch = async () => {
        setCollections(await props.fetchpackages('on-transit'))
        setAssign(await props.fetchpackages('recieved-warehouse'))
        setDoorstep(await props.fetchpackages('assigned'))
        setAssignDoorStep(await props.fetchpackages('assigned'))
    }

    useEffect(() => {
        fetch()
    }, [])

    return (
        <Layout>
            <div className='flex w-full gap-x-20 '>
                <DashboardWHItem obj={{ title: 'Collect From Riders', value: collect.length, state: "on-transit", data: collect }} />
                <DashboardWHItem obj={{ title: 'Assign to Riders', value: assign.length, state: "recieved-warehouse", data: collect }} />
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

export default connect(mapStateToProps, { get_agents, get_zones, assign, fetchpackages })(Index)

