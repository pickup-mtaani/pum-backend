import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useLocation } from 'react-router-dom'
import Layout from '../../../views/Layouts'
import { connect } from 'react-redux'
import { get_riders, } from '../../../redux/actions/riders.actions'
import { get_agents, get_zones, CollectDoorStep, assign, fetchpackages, fetchAgentpack } from '../../../redux/actions/agents.actions'
import { assignwarehouse } from '../../../redux/actions/package.actions'
function Riderpage(props) {

    const location = useLocation()
    const [data, setData] = useState([])
    const [data1, setData1] = useState([])
    const fetch = async (data, agent) => {
        let res = await props.fetchAgentpack(location?.state?.agent)
        setData(res)
    }
    useEffect(() => {
        console.log(location.state)
        fetch()

    }, [])
    const packAction = async (id, state, rider) => {
        await props.assignwarehouse(id, state, rider)
        let res = await props.fetchAgentpack(location?.state?.agent)
        setData(res)
    }
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
            selector: row => (

                <>
                    <div className=' p-2 bg-slate-200 border' onClick={() => packAction(row._id, "assigned-warehouse", location.state.rider)}> Assign</div>
                    {/* <select className=" bg-primary-500 w-38 mb-2 mx-2 rounded-md float-right h-10 flex justify-center items-center px-2 border-none" onChange={

                        (e) => packAction(row._id, "assigned-warehouse", e.target.value)
                    }>
                        <option value="">Assign a new Rider</option>
                        {props.riders?.map((rider, i) => (
                            <option key={i} value={rider?.user?._id} >{rider?.user?.name}</option>
                        ))}

                    </select> */}

                </>)
        },

    ]


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
            {/* <ConfirmModal
                // showModal={setShowModal}
                // item={item}
                msg="Are you sure You want to Recieve this package"
                show={show}
              
                Submit={() => props.CollectDoorStep(id, "recieved-warehouse")}
            /> */}
        </Layout>
    )
}
const mapStateToProps = (state) => {
    return {

        agents: state.agentsData.agents,
        packages: state.agentsData.packs,
        loading: state.agentsData.loading,
        riders: state.ridersDetails.riders,

    };
};

export default connect(mapStateToProps, { get_agents, get_zones, assign, CollectDoorStep, get_riders, fetchAgentpack, assignwarehouse })(Riderpage)


