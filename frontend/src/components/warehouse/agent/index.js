import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { get_agents, get_zones, assign, fetchpackages } from '../../../redux/actions/agents.actions'
import Layout from '../../../views/Layouts'
import { DashboardWHItem } from '../../DashboardItems'
import { useLocation } from 'react-router-dom'
const Index = props => {

    const location = useLocation()
    return (
        <Layout>
            <div className='flex w-full gap-x-20 '>
                <DashboardWHItem obj={{ title: 'Collect From Riders', type: "agents", value: location?.state?.data?.dropped, state: "on-transit", }} />
                <DashboardWHItem obj={{ title: 'Assign to Riders', value: location?.state?.data?.recieved, state: "recieved-warehouse" }} />
            </div>

        </Layout>
    )
}

const mapStateToProps = (state) => {
    return {

        agents: state.agentsData.agents,
        packages: state.agentsData.packs,
        loading: state.agentsData.loading,

    };
};

export default connect(mapStateToProps, { get_agents, get_zones, assign, fetchpackages })(Index)

