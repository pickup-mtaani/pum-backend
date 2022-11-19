import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useLocation } from 'react-router-dom'
import Layout from '../../../views/Layouts'
import { connect } from 'react-redux'
import { get_agents, get_zones, CollectDoorStep, assign, fetchpackages, fetchdoorpackages } from '../../../redux/actions/agents.actions'
import { assignwarehouse } from '../../../redux/actions/package.actions'
import ConfirmModal from '../../confirm'
function Riderpage(props) {

    const location = useLocation()
    const [data, setData] = useState([])
    const [show, setShow] = useState(false)
    const [id, setId] = useState([])
    const fetch = async (data, agent) => {
        let res = await props.fetchdoorpackages("dropped", location?.state?.id)

        setData(res)


    }
    const packAction = async (id, state, rider) => {
        // recieved-warehouse
        await props.assignwarehouse(id, state, rider)
        setData(await props.fetchpackages("dropped", location?.state?.agent))
        await fetch("dropped", location?.state?.agent)
    }
    useEffect(() => {

        fetch("dropped", location?.state?.agent)

    }, [])

    const Recieve = (row) => {

        setId(row._id)
        setShow(true)
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
            selector: row => (<>
                <button onClick={() => Recieve(row)}>Recieve package</button>
            </>)
        },

    ]
    const el = () => (
        <div className='flex text-black' >
            <h1>Are you sure You want to assign Brayo this package ?</h1>
        </div>
    )

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



            <ConfirmModal
                msg=" Recieve this package"
                show={show}
                // inputChange={inputChange}
                Submit={async () => { await props.CollectDoorStep(id, "recieved-warehouse"); setShow(false); fetch("dropped", location?.state?.agent) }}
            />
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

export default connect(mapStateToProps, { get_agents, get_zones, assign, CollectDoorStep, fetchdoorpackages, assignwarehouse })(Riderpage)


