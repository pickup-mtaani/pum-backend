import React from 'react'
import DataTable from 'react-data-table-component';


function PackageDetail(props) {
    const { toggle, show, data } = props
    console.log((data))

//     createdAt: "2022-08-25T17:08:30.143Z"
// customerName: "New customer "
// customerPhoneNumber: "0789001233"
// delivery_fee: 180
// isProduct: false
// packageName: "Shoes "
// package_value: 699
// receieverAgentID: "63064c850557495c4188f956"
// senderAgentID: "63064b370557495c4188f950"
// total_fee: 180
// updatedAt: "2022-08-25T17:08:30.143Z"
    const delivery_columns = [
        {
            sortable: true,
            name: 'package Name',
            minWidth: '150px',
            selector: row => row.packageName
        },
        {
            sortable: true,
            name: 'package Value',
            minWidth: '150px',
            selector: row => row.package_value
        },

        {

            sortable: true,
            name: 'customer Name',
            minWidth: '250px',
            selector: row => row.customerName
           
        },
        {
            sortable: true,
            name: 'customer Phone Number',
            minWidth: '250px',
            selector: row => row.customerPhoneNumber
        },

        {
            sortable: true,
            name: 'delivery fee',
            minWidth: '250px',
            selector: row => row.delivery_fee
        },

        // {
        //     sortable: true,
        //     name: 'Reciever Agent',
        //     minWidth: '150px',
        //     selector: row => row.receieverAgentID?.name
        // },
        // {
        //     sortable: true,
        //     name: 'Sender Agent',
        //     minWidth: '150px',
        //     selector: row => row.senderAgentID?.name
        // },

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
                                        <h3 className="text-xl font=bold uppercase">{props.modalTitle}</h3>
                                        <button
                                            className="bg-transparent border-0 text-black float-right"
                                            onClick={props.toggle}
                                        >
                                            <span className="text-black opacity-7 h-6 w-6 text-xl  py-0 rounded-full flex justify-center items-center">
                                                x
                                            </span>
                                        </button>
                                    </div>
                                    <div className="relative p-6 flex-auto">
                                        <DataTable
                                            // title=" Agent to Agent Delivery"
                                            columns={delivery_columns}
                                            data={props.data}
                                          
                                            persistTableHead
                                           
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

export default PackageDetail