import React from 'react'

function Manage(props) {
    const { toggle, show } = props

    console.log(props.employees)
    return (

        <>

            {
                show ? (
                    <>

                        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed top-0 right-0  left-0 z-50 outline-none focus:outline-none min-width:screen">
                            <div className="relative w-full rounded-sm my-6 mx-10 max-w-full  ">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                                        <h3 className="text-xl font=bold uppercase">{props?.data?.business_name}</h3>
                                        <button
                                            className="bg-transparent border-0 text-black float-right"
                                            onClick={props.toggle}
                                        >
                                            <span className="text-black opacity-7 h-6 w-6 text-xl  py-0 rounded-full flex justify-center items-center">
                                                x
                                            </span>
                                        </button>
                                    </div>

                                    <div className='p-5'>
                                        <h2 className='text-center'>Employees</h2>
                                        <table className='w-full'>
                                            <thead className='gap-x-1 border-b-2 border-red-200'>
                                                <th>Name</th>
                                                <th>Phone Number</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Action</th>
                                            </thead>
                                            <tbody className='gap-x-3' >
                                                {props?.employees?.map((emp, i) => (
                                                    <tr key={i}>
                                                        <td>{emp?.user?.name}</td>
                                                        <td>{emp?.user?.phone_number}</td>
                                                        <td>{emp?.user?.email}</td>
                                                        <td>agent</td>
                                                        <td></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </div>
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                                            type="button"
                                            onClick={props.toggle}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                            type="button"
                                            onClick={props.submit}
                                        >
                                            Submit
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

export default Manage