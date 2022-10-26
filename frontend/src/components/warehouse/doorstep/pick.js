import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { get_agents, get_zones, assign, fetchdoorpackages } from '../../../redux/actions/agents.actions'
import Layout from '../../../views/Layouts'
import { DashboardWHItem } from '../../DashboardItems'
import { useLocation } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import moment from 'moment'
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

            <div className='w-full p-2 flex '>
                <div className='w-1/4 '>
                    <div className='m-1 w-full h-20 bg-red-100'></div>
                </div>

                <div className='w-1/4'>
                    <div className='m-1 w-full h-20 bg-red-200'></div>
                </div>


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

