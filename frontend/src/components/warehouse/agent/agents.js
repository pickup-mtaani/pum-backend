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

        if (location.state?.title === "Collect From Riders") {
            const result = await props.get_agents(location?.state?.id, "dropped")
            setData(result.sender_agents_count)

        } else {
            const result = await props.get_agents(location?.state?.id, "recieved-warehouse")
            setData(result.reciever_agents_count)

        }

    }
    useEffect(() => {
        fetch()
    }, [])

    console.log(location)
    return (
        <Layout>
            <div className='flex justify-center items-center py-10'>
                <h2 className='text-uppercase text-3xl underline'>{location?.state?.title}</h2>
            </div>

            <h2 className='text-center p-10 text-xl '> </h2>
            <div className='flex  w-full'>
                <div className='flex flex-wrap gap-1  w-full'>
                    {data.map((agent, i) => (
                        <Dashboardagents key={i} agent={agent} count={agent.count} rider={location?.state?.id} id={agent?.agent?._id} title={location?.state?.title} path={location?.state?.lis} name={agent?.agent?.business_name} />
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

