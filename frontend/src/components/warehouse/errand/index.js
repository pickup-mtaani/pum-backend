import React, { useEffect, useState } from 'react'
import { Link, unstable_HistoryRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { get_agents, get_zones, assign, fetcherrandspackages } from '../../../redux/actions/agents.actions'
import Layout from '../../../views/Layouts'
import { DashboardWHItem } from '../../DashboardItems'
import { useLocation } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import moment from 'moment'
const Index = props => {


    return (
        <Layout>

            <div className='flex w-full gap-x-20 '>
                <div className="bg-white  w-1/2  ">
                    <Link
                        to={{
                            pathname: `/wahehouse/errand/pick-packages`,

                        }}

                    > <div className="bg-white h-40  w-full  rounded-xl shadow-sm flex">
                            <div className="h-full w-4/6 ">
                                <div className=" w-full flex flex-col p-3">
                                    <h1 className="font-bold text-gray-400 text-xl">Pick From Rider</h1>
                                </div>
                            </div>

                        </div>
                    </Link>
                </div >
                <div className='flex w-full gap-x-20 '>
                    <div className="bg-white  w-1/2  ">
                        <Link
                            to={{
                                pathname: `/wahehouse/errand/assign-rider`,
                            }}

                        > <div className="bg-white h-40  w-full  rounded-xl shadow-sm flex">
                                <div className="h-full w-4/6 ">
                                    <div className=" w-full flex flex-col p-3">
                                        <h1 className="font-bold text-gray-400 text-xl">Assign to Rider</h1>
                                    </div>
                                </div>

                            </div>
                        </Link>
                    </div >
                </div>
                {/* <DashboardWHItem obj={{ title: 'Assign to Riders', value: location?.state?.data?.recieved, state: "recieved-warehouse", data: collect }} /> */}
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

export default connect(mapStateToProps, { get_agents, get_zones, assign, fetcherrandspackages })(Index)

