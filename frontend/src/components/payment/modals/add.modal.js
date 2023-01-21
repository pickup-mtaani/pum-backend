import React from 'react'


function Add(props) {
    const { toggle, show, zones, riders } = props


    return (

        <>

            {
                show ? (
                    <>

                        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none min-width:screen">
                            <div className="relative w-1/3 rounded-sm my-6 mx-auto max-w-3xl  ">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                                        <h3 className="text-xl font=bold uppercase">Add Route</h3>
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
                                        <div className="w-full flex flex-col gap-y-2 ">
                                            <div className="flex  gap-x-10">
                                                <div className="w-24">Name</div>
                                                <input type="text" className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder="Admin Name" name="name" />
                                            </div>
                                            <div className="flex  gap-x-10">
                                                <div className="w-24">Rider</div>
                                                <select name="rider" onChange={props.changeInput} className="bg-transparent border-b border-slate-500 pt-5 pb-5 ">
                                                    <option value="">Selected gender</option>
                                                    {riders?.map((rider, i) => (
                                                        <option value={rider?.user?._id} onChange={props.changeInput}>{rider?.user?.name}</option>
                                                    ))}


                                                </select>
                                            </div>
                                            <div className="flex  gap-x-10">
                                                <div className="w-24">Zone</div>
                                                <select name="zone" onChange={props.changeInput} className="bg-transparent border-b border-slate-500 pt-5 pb-5 ">
                                                    <option value="">Selected gender</option>
                                                    {zones?.map((zone, i) => (
                                                        <option value={zone._id} onChange={props.changeInput}>{zone.name}</option>
                                                    ))}


                                                </select>
                                            </div>

                                        </div>
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

export default Add