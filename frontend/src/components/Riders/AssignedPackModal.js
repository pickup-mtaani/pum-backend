import React, { useState } from 'react'
import DataTable from 'react-data-table-component';
import { get_riders, assignRider } from '../../redux/actions/riders.actions'
import { connect } from 'react-redux'
import moment from 'moment';
function AssignedPackModal(props) {
    const { toggle, show, data } = props
    const [rider, setRider] = useState("")

    console.log(data[0])


    // {_id: '631ba5a3a932b018eb3c1924', rider: '631b4c17aecaec632d626671', package: {…}, deleted_at: null, createdAt: '2022-09-09T20:44:19.034Z', …}
    // createdAt: "2022-09-09T20:44:19.034Z"
    // deleted_at: null
    // package:
    // businessId: "631b12b467e2b76af15bd658"
    // createdAt: "2022-09-09T20:15:27.301Z"
    // createdBy: {_id: '631b128467e2b76af15bd650', l_name: 'Maina', f_name: 'Eric', verification_code: 21982, deleted_at: null, …}
    // customerName: "New customer "
    // customerPhoneNumber: "0722334455"
    // delivery_fee: 200
    // isProduct: false
    // packageName: "Shoes"
    // package_value: 1209
    // payment_phone_number: "0790923387"
    // payment_status: "Not Paid"
    // receieverAgentID: {_id: '6312cc4366dfa8b3d1695f2e', name: 'MACHAKOS', zone: '6305fa9e2ad0d5bb37f8ef58', lng: 37.2634, lat: 1.5177, …}
    // receipt_no: "PM-BXU6K"
    // senderAgentID: {_id: '6312cbff66dfa8b3d1695f2b', name: 'YAYA(KILIMANI)', zone: '6305fa972ad0d5bb37f8ef55', lng: 36.787758, lat: -1.293053, …}
    // state: "pending"
    // total_fee: 200
    // total_payment: 180
    // type: "agent"
    // updatedAt: "2022-09-09T20:15:27.301Z"
    // __v: 0
    // _id: "631b9edf09ed770c87cad209"
    // [[Prototype]]: Object
    // rider: "631b4c17aecaec632d626671"
    // updatedAt: "2022-09-09T20:44:19.034Z"
    const door_step_columns = [

        {
            sortable: true,
            name: 'Name',
            minWidth: '250px',
            // total_payment_amount: total_payment_amount
            selector: row => row.package?.packageName
        },
        {
            sortable: true,
            name: 'Value',
            minWidth: '250px',
            selector: row => row.package?.package_value
        },
        {
            sortable: true,
            name: 'Sender',
            minWidth: '250px',
            selector: row => (<>{row.package?.createdBy?.f_name} {row.package?.createdBy?.l_name}</>),
        },
        {
            sortable: true,
            name: 'Sender Agent ',
            minWidth: '250px',
            selector: row => row.package?.senderAgentID?.name,
        },

        {
            sortable: true,
            name: 'Reciever Agent ',
            minWidth: '250px',
            selector: row => row.package?.receieverAgentID?.name,
        },


    ]
    return (

        <>

            {
                show ? (
                    <>

                        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none min-width:screen">
                            <div className="relative w-full h-full rounded-sm my-6 mx-auto max-w-5xl  ">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                                        <h3 className="text-xl font=bold uppercase">Packages assigned</h3>
                                        <button
                                            className="bg-transparent border-0 text-black float-right"
                                            onClick={props.toggle}
                                        >
                                            <span className="text-black opacity-7 h-6 w-6 text-xl  py-0 rounded-full flex justify-center items-center">
                                                x
                                            </span>
                                        </button>
                                    </div>
                                    <div className="relative p-6 flex-auto ">
                                        <DataTable
                                            // title={`${props.data.rider?.rider_name}'s Packages`}
                                            columns={door_step_columns}
                                            data={props.data}
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
                                        />
                                    </div>
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                        <button
                                            className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                            type="button"
                                            onClick={props.toggle}
                                        >
                                            Ok
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
                ) : null
            }</>
    );
};

const mapStateToProps = (state) => {
    return {

    };
};
export default connect(mapStateToProps, { get_riders, assignRider })(AssignedPackModal)