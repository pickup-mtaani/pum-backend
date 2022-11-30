import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_riders, assignRider } from '../../redux/actions/riders.actions'
import { getParcels } from '../../redux/actions/package.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import moment from 'moment'
function Rent(props) {



    let initialState = {
        name: '', email: "", phone_number: '', password: ''
    }
    const [filterText, setFilterText] = React.useState('');
    const [searchValue, setSearchValue] = useState("")
    const [date, setDate] = useState("")
    const [data1, setData] = useState("")
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

    const rent_shelf_columns = [
        {
            sortable: true,
            name: 'Business Name',
            minWidth: '250px',
            selector: row => row.businessId?.name
        },

        {
            sortable: true,
            name: 'Reciept',
            minWidth: '250px',
            selector: row => row.receipt_no
        },
        {
            sortable: true,
            name: 'Stored At ',
            minWidth: '250px',
            selector: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            sortable: true,
            name: 'Packages',
            minWidth: '250px',
            selector: row => (<>
                {row.packages.map((pack, i) => (
                    <div key={i} className='py-2' onClick={() => { setShowModal(true); setItem(row.packages) }}>
                        <span style={{ fontWeight: 'bold', paddingLeft: 2, fontStyle: 'italic' }}>{row.packages.length} item(s)</span>
                    </div>
                ))}

            </>)
        },


    ]

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
        let result = await props.getParcels({ limit: limit, state: value })
        await props.get_riders()

        setData(result);
    };

    const handlePerRowsChange = async (newPerPage) => {
        setLimit(newPerPage)
        let result = await props.getParcels({ limit: newPerPage, state: state })
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
                {/* <select name="gender" onChange={changeInput} className="bg-transparent border-b border-slate-500 pt-5 pb-5 ">
                    <option value="">Select State</option>
                    {agentState.map((state, i) => (
                        <option key={i} value={state} onChange={changeInput}>{state}</option>
                    ))}

                </select> */}

            </>
        );
    }, [searchValue, date, showModal]);
    const fetch = async () => {
        let result = await props.getParcels({ limit: limit, state: state })
        await props.get_riders()

        setData(result);

    }
    useEffect(() => {
        fetch()
    }, [])

    return (

        <div className=" mx-2 my-10">
            <DataTable
                title="Rent A shelf Delivery"
                columns={rent_shelf_columns}
                data={props.rent_shelf}
                pagination
                paginationServer
                progressPending={props.loading}
                paginationResetDefaultPage={resetPaginationToggle}
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
                // onChangePage={handlePageChange}
                paginationTotalRows={totalRows}
            // onChangeRowsPerPage={handlePerRowsChange}
            />
        </div>


    )
}

Rent.propTypes = {}


const mapStateToProps = (state) => {
    return {
        riders: state.ridersDetails.riders,
        packages: state.PackageDetails.packages,
        loading: state.PackageDetails.loading,
        to_door_packages: state.PackageDetails.to_door_packages,
        rent_shelf: state.PackageDetails.rented_shelf_packages

    };
};

export default connect(mapStateToProps, { getParcels, get_riders, assignRider })(Rent)

