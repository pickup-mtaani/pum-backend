import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useLocation } from 'react-router-dom'
import Layout from '../../views/Layouts'
import { connect } from 'react-redux'
import { get_agents, get_zones, assign, fetchpackages, fetchdoorpackages } from '../../redux/actions/agents.actions'
import { assignwarehouse } from '../../redux/actions/package.actions'
function Riderpage(props) {

    const location = useLocation()
    const [data, setData] = useState([])
    const [data1, setData1] = useState([])
    const fetch = async (data, agent) => {
        if (location.state.type === "door") {
            let res = await props.fetchdoorpackages("dropped", agent)
            let resr = await props.fetchdoorpackages("recieved-warehouse", agent)

            setData(res)
            setData1(resr)
        } else {
            let res = await props.fetchpackages("dropped", agent)
            let resr = await props.fetchpackages("recieved-warehouse", agent)

            setData(res)
            setData1(resr)
        }
    }
    const packAction = async (id, state, rider) => {
        await props.assignwarehouse(id, state, rider)
        setData(await props.fetchpackages("dropped", location?.state?.agent))
        await fetch("dropped", location?.state?.agent)
    }
    useEffect(() => {
        console.log(location.state)
        fetch("dropped", location?.state?.agent)

    }, [])
    console.log(JSON.stringify(location?.state))
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
    // console.log(JSON.stringify(data))

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
                /></div> : <div className=" mx-2">
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
                /></div>}
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

export default connect(mapStateToProps, { get_agents, get_zones, assign, fetchpackages, fetchdoorpackages, assignwarehouse })(Riderpage)


