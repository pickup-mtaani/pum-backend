import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../views/Layouts'
import { DashboardRider, WHItem } from '../DashboardItems'
import { rentShelfagents } from '../../redux/actions/agents.actions'
import { connect } from 'react-redux'
const Agents = (props) => {
    const [data, setData] = useState([])
    const fetch = async () => {
        const results = await props.rentShelfagents()
        setData(results)
    }
    useEffect(() => {
        fetch()
    }, [])
    console.log("Agents", props.agents[0]?.business_name)
    return (
        <Layout>
            <div className='w-full p-2 flex flex-wrap '>

                <div className='flex  w-full'>
                    <div className='flex flex-wrap gap-1  w-full'>
                        {props.agents.map((rider, i) => (
                            <div className='w-1/4 p-2' key={i} >
                                <Link
                                    to={{ pathname: `/rent-a-shelf/philadelphiahouse/agents/${rider?.business_name.replace(/\s/g, '')}` }} state={{

                                        id: rider._id
                                    }} >
                                    <div className='m-1 w-full bg-red-100 flex flex-col pb-2' >
                                        <div className='m-1 w-full h-20  bg-red-100 flex justify-center items-center'>
                                            <div className='text-center justify-center items-center flex flex-col '>
                                                <div className=' bg-slate-100 h-12 w-12 rounded-full flex justify-center align-center flex items-center'>{rider?.package_count} </div>
                                                {rider?.business_name}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </Layout >
    )
}
const mapStateToProps = (state) => {
    return {

        // loading: state.PackageDetails.loading,
        agents: state.agentsData.rs_agents,
        loading: state.agentsData.loading,
        // rent_shelf: state.PackageDetails.rented_shelf_packages

    };
};

export default connect(mapStateToProps, { rentShelfagents })(Agents)
