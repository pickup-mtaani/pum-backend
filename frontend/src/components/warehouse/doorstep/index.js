import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { get_agents, get_zones, assign, fetchdoorpackages } from '../../../redux/actions/agents.actions'
import Layout from '../../../views/Layouts'
import { DashboardWHItem } from '../../DashboardItems'
import { useLocation } from 'react-router-dom'
const Index = props => {
    const [collect, setCollections] = useState([])
    const [assign, setAssign] = useState([])
    const [doorStep, setDoorstep] = useState([])
    const [assignDoorstep, setAssignDoorStep] = useState([])
    const location = useLocation()
    const fetch = async () => {

        setCollections(await props.fetchdoorpackages('dropped'))
        setAssign(await props.fetchdoorpackages('recieved-warehouse'))
        setDoorstep(await props.fetchdoorpackages('assigned'))
        setAssignDoorStep(await props.fetchdoorpackages('assigned'))
    }



    useEffect(() => {

        fetch()
    }, [])

    return (
        <Layout>
            <div className='flex w-full gap-x-20 '>
                <DashboardWHItem obj={{ title: 'Collect From Riders', type: "doorstep", value: location?.state?.data?.dropped, state: "dropped", data: collect }} />
                <DashboardWHItem obj={{ title: 'Assign to Riders', value: location?.state?.data?.recieved, state: "recieved-warehouse", data: collect }} />
            </div>

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

export default connect(mapStateToProps, { get_agents, get_zones, assign, fetchdoorpackages })(Index)

