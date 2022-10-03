import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { get_agents, get_zones, assign, fetchpackages } from '../../redux/actions/agents.actions'
import Layout from '../../views/Layouts'
import { DashboardWHItem } from '../DashboardItems'
const Index = props => {


    useEffect(() => {
        // fetch()
    }, [])

    return (
        <Layout>



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

