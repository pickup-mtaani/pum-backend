import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useLocation } from 'react-router-dom'
import Layout from '../../../views/Layouts'
import { connect } from 'react-redux'
import { get_riders, } from '../../../redux/actions/riders.actions'
import { get_agents, get_zones, CollectDoorStep, assign, fetchpackages, fetchdoorpack } from '../../../redux/actions/agents.actions'
import { assignwarehouse } from '../../../redux/actions/package.actions'
function Riderpage(props) {

    const location = useLocation()
    const [data, setData] = useState([])
    const [data1, setData1] = useState([])
    const fetch = async (data, agent) => {
        let res = await props.fetchdoorpack("recieved-warehouse")
        await props.get_riders()
        setData(res)


    }
    const packAction = async (id, state, rider) => {
        // recieved-warehouse
        await props.assignwarehouse(id, state, rider)
        setData(await props.fetchpackages("dropped", location?.state?.agent))
        await fetch("dropped", location?.state?.agent)
    }
    useEffect(() => {

        fetch()

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
                <select className=" bg-primary-500 w-38 mb-2 mx-2 rounded-md float-right h-10 flex justify-center items-center px-2 border-none" onChange={(e) => props.CollectDoorStep(row._id, "assigned", e.target.value)}>
                    <option value="">Assign a new Rider</option>
                    {props.riders?.map((rider, i) => (
                        <option key={i} value={rider?.user?._id} >{rider?.user?.name}</option>
                    ))}

                </select>
                {/* <button onClick={() => props.CollectDoorStep(row._id, "assigned")}>AssignRider package { }</button> */}
            </>)
        },

    ]
    // console.log(JSON.stringify(data))

    return (
        <Layout>
            <div className=" mx-2">
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
                /></div>
        </Layout>
    )
}
const mapStateToProps = (state) => {
    return {

        agents: state.agentsData.agents,
        packages: state.agentsData.packs,
        loading: state.agentsData.loading,
        riders: state.ridersDetails.riders,
        // error: state.userDetails.error,
    };
};

export default connect(mapStateToProps, { get_agents, get_zones, assign, CollectDoorStep, get_riders, fetchdoorpack, assignwarehouse })(Riderpage)


