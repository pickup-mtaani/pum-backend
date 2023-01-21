import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_riders, assignRider } from '../../redux/actions/riders.actions'
import { getagentParcels, togglePayment } from '../../redux/actions/package.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
import PackageDetail from './AssignRiderModal'
import moment from 'moment'
function Agent(props) {



    const [filterText, setFilterText] = React.useState('');
    const [searchValue, setSearchValue] = useState("")
    const [date, setDate] = useState("")
    const [data1, setData] = useState([])
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
    const [RowsPerPage, setRowsPerPage] = useState(5)
    const [limit, setLimit] = useState(5)
    const [totalRows, setTotalRows] = useState(0);
    const [state, setstate] = useState("all");
    const [data, setFilterData] = React.useState([]);
    const [showModal, setShowModal] = useState(false);
    const [item, setItem] = useState([]);
    const agentState = [
        "all", "request", "delivered", "cancelled", "on-transit", "assigned", "dropped", "picked", "unavailable", "dropped", "assigned-warehouse", "warehouse-transit"
    ]
    const onChangeFilter = (e) => {
        setFilterText(e)

    }


    const conditionalRowStyles = [
        {
            when: row => row.state === "cancelled",
            style: {
                backgroundColor: 'pink',
                color: 'white',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },
        {
            when: row => row.state === "unavailable",
            style: {
                backgroundColor: 'cyan',
                color: 'white',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },

    ];

    const changeInput = async (e) => {
        const { value } = e.target;
        setstate(value)
        let result = await props.getagentParcels({ limit: limit, state: value })
        await props.get_riders()

        setData(result);
    };
    const delivery_columns = [

        {
            sortable: true,
            name: 'payment_status ',
            wrap: true,
            selector: row => (<>{row.payment_status === "Not Paid" ? <div className='p-2 border border-gray-700 bg-primary-500'
                onClick={async () => { await props.togglePayment(row._id, "agent"); await fetch() }}>Pay Now</div> : "Paid"}</>),
        },
        {
            sortable: true,
            name: 'Reciept',
            wrap: true,
            selector: row => row.receipt_no
        },
        {
            sortable: true,
            name: 'Reciept',
            wrap: true,
            selector: row => row.state
        },
        {
            sortable: true,
            name: 'Name',
            defaultExpanded: true,
            wrap: true,
            selector: row => <>{row.packageName}
                {/* {row._id} */}
                {/* {row.state} */}
                {/* {row.assignedTo} */}
            </>
        },
        {
            sortable: true,
            name: 'Value',
            wrap: true,
            selector: row => row.package_value
        },

        {
            sortable: true,
            name: 'Customer',
            wrap: true,
            selector: row => row.customerName
        },
        {
            sortable: true,
            name: 'Customer Phone',
            wrap: true,
            selector: row => row.customerPhoneNumber
        },
        {
            sortable: true,
            name: 'Assined To',
            wrap: true,
            selector: row => row.assignedTo?.name
        },
        {
            sortable: true,
            name: 'Sender',
            wrap: true,

            selector: row => row.senderAgentID?.business_name
        },
        {
            sortable: true,
            name: 'Reciever',

            wrap: true,
            selector: row => row.receieverAgentID?.business_name
        },

        {
            sortable: true,
            name: 'Delivery Fee',
            wrap: true,
            selector: row => row.delivery_fee
        },


        {
            sortable: true,
            name: 'Total Fee Paid',
            wrap: true,
            selector: row => row.total_fee
        },

        {
            sortable: true,
            name: 'Sent At ',
            wrap: true,
            selector: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        },


    ]


    const handlePerRowsChange = async (newPerPage) => {
        setLimit(newPerPage)
        let result = await props.getagentParcels({ limit: newPerPage, state: state })
        await props.get_riders()

        setData(result);
        setRowsPerPage(newPerPage)
    };
    const subHeaderComponentMemo = React.useMemo(() => {

        return (
            <>
                <Search_filter_component
                    onChangeFilter={onChangeFilter}

                    searchValue={searchValue}
                    date={date}
                    showModal={showModal}
                    download={() => DownloadFile(() =>
                        props.FetchAdmins({ date, limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
                        `${totalRows > 0 ? totalRows : "all"}_users`
                    )}
                />
                <select name="gender" onChange={changeInput} className="bg-transparent border-b border-slate-500 pt-5 pb-5 ">
                    <option value="">Select State</option>
                    {agentState.map((state, i) => (
                        <option key={i} value={state} onChange={changeInput}>{state}</option>
                    ))}

                </select>

            </>
        );
    }, [searchValue, date, showModal]);
    const fetch = async () => {
        let result = await props.getagentParcels()


        setData(result.data);

    }
    useEffect(() => {
        fetch()
    }, [])

    return (

        <div className=" mx-2">
            <DataTable
                title=" Agent to Agent Delivery"
                columns={delivery_columns}
                data={data1}
                pagination
                paginationServer
                progressPending={props.loading}
                conditionalRowStyles={conditionalRowStyles}
                paginationResetDefaultPage={resetPaginationToggle}
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
                expandableRowExpanded={row => row.defaultExpanded}
                // onChangePage={handlePageChange}
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
            />
            <PackageDetail
                show={showModal}
                data={item}
                riders={props.riders}
                fetch={() => fetch()}
                loading={props.loading}
                // changeInput={(e) => changeInput(e)}
                // submit={() => submit()}
                toggle={() => setShowModal(false)}
            />
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        riders: state.ridersDetails.riders,
        packages: state.PackageDetails.packages,
        loading: state.PackageDetails.agentloading,

    };
};

export default connect(mapStateToProps, { getagentParcels, get_riders, assignRider, togglePayment })(Agent)

