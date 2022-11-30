import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Link, useLocation } from 'react-router-dom'
import Layout from '../../views/Layouts'
import { connect } from 'react-redux'
import { get_agents, Rideagents, get_zones, assign, fetchpackages, fetchdoorpackages } from '../../redux/actions/agents.actions'
import { assignwarehouse } from '../../redux/actions/package.actions'

// Rideagents
function Riderpage(props) {

    const location = useLocation()
    const [data, setData] = useState([])
    const [assign, setAssign] = useState([])
    const [data1, setData1] = useState([])
    const fetch = async (data, agent) => {
        let res = await props.fetchpackages("dropped", agent)
        let agents = await props.Rideagents(location?.state?.id)

        setAssign(agents)
        let resr = await props.fetchpackages("recieved-warehouse", agent)
        setData(res)
        setData1(resr)

    }
    const packAction = async (id, state, rider) => {
        await props.assignwarehouse(id, state, rider)
        setData(await props.fetchpackages("dropped", location?.state?.agent))


        await fetch("dropped", location?.state?.agent)
    }
    const complete = () => {
        // if (location?.state?.lis === "on-transit") {
        //     packAction(id, "recieved-warehouse", location?.state?.id)
        // } else {
        //     packAction(id, "assigned-warehouse", location?.state?.id)
        // }

    }
    useEffect(() => {

        fetch("dropped", location?.state?.agent)



    }, [])

    const Sellers_columns = [

        {
            sortable: true,
            name: 'Name',
            minWidth: '250px',
            selector: row => row.packageName
        },
        {
            sortable: true,
            name: 'Business',
            minWidth: '250px',
            selector: row => row.businessId?.name
        },
        {
            sortable: true,
            name: 'Action',
            minWidth: '150px',
            selector: row => (<>
                {location?.state?.lis === "on-transit" ? <button onClick={() => packAction(row._id, "recieved-warehouse", location?.state?.id)}>Recieve package { }</button> : location?.state?.lis === "recieved-warehouse" ? <button onClick={() => packAction(row._id, "assigned-warehouse", location?.state?.id)}>Assign Package  </button> : null}
            </>)
        },

    ]

    return (
        <Layout>
            {location?.state?.title === "Collect From Riders" ? <div className=" mx-2">
                <DataTable
                    title={location?.state?.title}
                    columns={Sellers_columns}
                    data={data}
                    pagination
                    paginationServer
                    // progressPending={props.loading}
                    // paginationResetDefaultPage={resetPaginationToggle}
                    subHeader
                    // subHeaderComponent={subHeaderComponentMemo}
                    persistTableHead
                // onChangePage={handlePageChange}
                // paginationTotalRows={totalRows}
                // onChangeRowsPerPage={handlePerRowsChange}
                /></div> :
                <>
                    <div className='w-full p-2 flex flex-wrap '>
                        {assign?.map((rider, i) => (
                            <div className='w-1/4 p-2' key={i}>
                                <Link
                                    to={{
                                        pathname: `/wahehouse/agent-agent/assign-rider`,
                                    }}
                                    state={{
                                        agent: rider?.agent?._id,
                                        rider: location.state.id
                                    }}
                                >
                                    <div className='m-1 w-full h-60 bg-red-100 flex justify-center items-center'>
                                        <div className='text-center justify-center items-center flex flex-col'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {rider?.agent?.business_name}
                                        </div>
                                    </div>
                                </Link>
                            </div>

                        ))}

                        {/* <div className='w-1/4'>
                    <div className='m-1 w-full h-60 bg-red-200'></div>
                </div> */}


                    </div>
                    {/* <div className=" mx-2">
                <DataTable
                    title={location?.state?.title}
                    columns={Sellers_columns}
                    data={data1}
                    pagination 
                    paginationServer
                    // progressPending={props.loading}
                    // paginationResetDefaultPage={resetPaginationToggle}
                    subHeader
                    // subHeaderComponent={subHeaderComponentMemo}
                    persistTableHead
                // onChangePage={handlePageChange}
                // paginationTotalRows={totalRows}
                // onChangeRowsPerPage={handlePerRowsChange}
                /></div> */}
                </>
            }
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

export default connect(mapStateToProps, { get_agents, get_zones, Rideagents, assign, fetchpackages, fetchdoorpackages, assignwarehouse })(Riderpage)


