import React, { useEffect, useState } from 'react'

import { connect } from 'react-redux'
import { get_agents, fetchpackages } from '../../../redux/actions/riders.actions'
import { useLocation } from 'react-router-dom'
import Layout from '../../../views/Layouts'
import { Dashboardagents, DashboardRider } from '../../DashboardItems'

function ActionPage(props) {
    const location = useLocation()
    const [data, setData] = useState([])

    const fetch = async () => {
        const result = await props.get_agents(location?.state?.id)

        setData(result)
    }
    useEffect(() => {
        fetch()


    }, [])

    console.log("Agents", props.riders)
    return (
        <Layout>
            <div className='flex justify-center items-center py-10'>
                <h2 className='text-uppercase text-3xl underline'>{location?.state?.title}</h2>
            </div>

            <h2 className='text-center p-10 text-xl '> </h2>
            <div className='flex  w-full'>
                <div className='flex flex-wrap gap-1  w-full'>
                    {data.map((agent, i) => (
                        <Dashboardagents key={i} agent={agent} id={agent?.agent?._id} title={"ocation?.state?.title"} path={location?.state?.lis} name={agent?.agent?.business_name} />
                    ))}
                </div>
            </div>


        </Layout>
    )
}

ActionPage.propTypes = {}


const mapStateToProps = (state) => {
    return {

        riders: state.ridersDetails.riders,
        loading: state.ridersDetails.loading,

    };
};

export default connect(mapStateToProps, { get_agents, fetchpackages })(ActionPage)

