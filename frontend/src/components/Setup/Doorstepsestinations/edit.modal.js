import React from 'react'

function Add_admin(props) {
    const { toggle, show } = props
    return (
        <>
            {
                show ? (
                    <>
                        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed top-0 right-0  left-0 z-50 outline-none focus:outline-none min-width:screen">
                            <div className="relative w-full rounded-sm my-6 mx-10 max-w-full  ">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                                        <h3 className="text-xl font=bold uppercase">Edit Agent</h3>
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
                                        <div className='bg-slate-100 w-full h-full flex'>
                                            <div className='bg-slate-100 w-1/2 p-10 h-full'>
                                                <div className="w-full flex flex-col gap-y-2 ">
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Name</div>
                                                        <input type="text"
                                                            value={props.item.business_name}
                                                            className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder=" Name" name="name" />
                                                    </div>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Contact</div>
                                                        <input type="text" className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder=" phone number"
                                                            value={props.item.user?.phone_number}
                                                            name="phone_number" />
                                                    </div>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Description</div>
                                                        <input type="agent_description"
                                                            value={props.item.agent_description}
                                                            autoComplete="off" className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder=" email" name="email" />
                                                    </div>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Mpesa No</div>
                                                        <input type="text" autoComplete="off" className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder="Mpesa No"
                                                            value={props.item.mpesa_number}
                                                            name="mpesa_number"
                                                        />
                                                    </div>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Riders</div>
                                                        <select className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput}>
                                                            <option value=""> {props.item.riderName ? props.item.riderName : "Select a rider"}</option>
                                                            {props.riders?.map((rider, i) => (
                                                                <option key={i} value={rider.user?._id} >{rider?.user?.name}</option>
                                                            ))}

                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='bg-slate-100 w-1/2 h-full p-10 '>
                                                <div className="w-full flex flex-col gap-y-2 ">
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Location </div>
                                                        <select className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput}>
                                                            <option value={props.item.location_id._id}> {props.item.locationName}</option>
                                                            {props.locations?.map((rider, i) => (
                                                                <option key={i} value={rider._id} >{rider?.name}</option>
                                                            ))}

                                                        </select>
                                                    </div>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Opening Hours</div>
                                                        <input type="text" className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder=" phone number"
                                                            value={props.item.opening_hours}
                                                            name="opning hours" />
                                                    </div>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Clossing Hours</div>
                                                        <input type="text" className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder=" phone number"
                                                            value={props.item.closing_hours}
                                                            name="cloasing hours" />
                                                    </div>
                                                    <div className='w-full flex align-end justify-between'>
                                                        <div className="w-24">Super Agent</div>
                                                        <div className="flex  gap-x-10">
                                                            <div className="w-24">Super Agent</div>
                                                            <input type="radio" autoComplete="off" className="" onChange={props.changeInput}
                                                                value={props.item.isSuperAgent}

                                                            />
                                                        </div>
                                                        <div className="flex  gap-x-10">
                                                            <div className="w-24">Activate</div>
                                                            <input type="radio" autoComplete="off" className="" onChange={props.changeInput}
                                                                value={props.item.isSuperAgent}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='w-full flex align-end justify-between'>
                                                        <div className="w-24">Location</div>
                                                        <div className="flex  gap-x-10">
                                                            <div className="w-24">Location</div>
                                                            <input type="radio" autoComplete="off" className="" onChange={props.changeInput}
                                                                value={props.item.isSuperAgent}
                                                            />
                                                        </div>
                                                        <div className="flex  gap-x-10">
                                                            <div className="w-24">Activate</div>
                                                            <input type="radio" autoComplete="off" className="" onChange={props.changeInput}
                                                                value={props.item.isSuperAgent}
                                                            />
                                                        </div>
                                                    </div>



                                                </div>
                                            </div>
                                        </div>

                                        {/* <div className='w-full gap-x-1 flex'>
                                            <div className="w-38">
                                                <div className='ml-2'>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Name</div>
                                                        <input type="text"
                                                            value={props.item.name}
                                                            className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder=" Name" name="name" />
                                                    </div>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Phone</div>
                                                        <input type="text" className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder=" phone number"
                                                            value={props.item.phone_number}
                                                            name="phone_number" />
                                                    </div>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Email</div>
                                                        <input type="email"
                                                            value={props.item.email}
                                                            autoComplete="off" className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder=" email" name="email" />
                                                    </div>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Password</div>
                                                        <input type="password" autoComplete="off" className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder="password" name="password" />
                                                    </div>

                                                </div>
                                                <div className='ml-2'>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Name</div>
                                                        <input type="text"
                                                            value={props.item.name}
                                                            className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder=" Name" name="name" />
                                                    </div>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Phone</div>
                                                        <input type="text" className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder=" phone number"
                                                            value={props.item.phone_number}
                                                            name="phone_number" />
                                                    </div>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Email</div>
                                                        <input type="email"
                                                            value={props.item.email}
                                                            autoComplete="off" className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder=" email" name="email" />
                                                    </div>
                                                    <div className="flex  gap-x-10">
                                                        <div className="w-24">Password</div>
                                                        <input type="password" autoComplete="off" className=" px-2 border border-slate-200 w-full py-2 rounded-md" onChange={props.changeInput} placeholder="password" name="password" />
                                                    </div>

                                                </div>
                                            </div>

                                        </div > */}

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
                                            onClick={props.item.id === "" ? props.submit : console.log('first')}
                                        >
                                            {props.item.id === "" ? "Submit" : "Update"}
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

export default Add_admin