import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { agents, get_zones, assign, fetchdoorpackages } from '../../../redux/actions/agents.actions'
import Layout from '../../../views/Layouts'
import { get_riders, fetchpackages, assignAgent } from '../../../redux/actions/riders.actions'
import { DashboardWHItem } from '../../DashboardItems'
import { useLocation } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import moment from 'moment'
const Index = props => {
    const [collect, setCollections] = useState([])
    const [data, setAssign] = useState([])
    const [doorStep, setDoorstep] = useState([])
    const [assignDoorstep, setAssignDoorStep] = useState([])
    const location = useLocation()
    const fetch = async () => {
        let results = await props.agents()
        setAssign(results)
    }

    useEffect(() => {

        fetch()
    }, [])

    return (
        <Layout>

            <div className='w-full p-2 flex flex-wrap '>
                {data.map((rider, i) => (
                    <div className='w-1/4 p-2' key={i}>
                        <Link
                            to={{
                                pathname: `/wahehouse/doorstep/assign-rider`,
                            }}
                            state={{
                                id: rider.user?._id,

                            }}
                        >
                            <div className='m-1 w-full h-60 bg-red-100 flex justify-center items-center'>
                                <div className='text-center justify-center items-center flex flex-col'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {rider?.business_name}
                                </div>
                            </div>
                        </Link>
                    </div>

                ))}

                {/* <div className='w-1/4'>
                    <div className='m-1 w-full h-60 bg-red-200'></div>
                </div> */}


            </div>

        </Layout>
    )
}

const mapStateToProps = (state) => {
    return {

        agents: state.agentsData.agents,
        packages: state.agentsData.packs,
        riders: state.ridersDetails.riders,
        loading: state.agentsData.loading,

    };
};

export default connect(mapStateToProps, { agents, get_zones, assign, fetchdoorpackages })(Index)

