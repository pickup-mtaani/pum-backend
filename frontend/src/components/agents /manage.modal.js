import React, { useState } from 'react'
import Add_admin from './add.modal';

function Manage(props) {
    const { toggle, show } = props
    let initialState = {
        name: '', email: "", phone_number: '', password: '', id: "", role: ''
    }
    const [item, setItem] = useState(initialState);
    const [showModal, setShowModal] = useState(false);

    const changeInput = (e) => {
        const { name, value } = e.target !== undefined ? e.target : e;

        setItem((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const submit = async () => {

        await props.add_employee(props.agent, item, item.role)
        await props.get_agents_employees(props.agent)
        setItem(initialState)
        setShowModal(false)
    }
    return (

        <>

            {
                show ? (
                    <>

                        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed top-0 right-0  left-80 z-50 outline-none focus:outline-none min-width:screen">
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
                                    <div className="relative p-6 flex-auto">
                                        <div className='bg-slate-100 w-full h-full flex'>
                                            <div className='bg-slate-100 w-full p-10 h-full'>
                                                <div className='p-5'>
                                                    <h2 className='text-center py-5 text-2xl tuppercase'>ATTENDANTS</h2>
                                                    <div className='bg-primary-500 w-38 mb-2 rounded-md float-right h-10 flex justify-center items-center px-2' onClick={() => setShowModal(true)}> Add an attendant</div>
                                                    <div className='bg-primary-500 w-38 mb-2 rounded-md float-right h-10 flex justify-center items-center px-2' onClick={() => props.activate_agents(props?.data?._id)}>Activate Super Attendant</div>

                                                    <select className=" bg-primary-500 w-38 mb-2 mx-2 rounded-md float-right h-10 flex justify-center items-center px-2 border-none" onChange={(e) => props.assign(e.target.value, props.agent)}>
                                                        <option value="">Assign a new Rider</option>
                                                        {props.riders?.map((rider, i) => (
                                                            <option key={i} value={rider?.user?._id} >{rider?.user?.name}</option>
                                                        ))}

                                                    </select>
                                                    <table className='w-full color-red-100'>
                                                        <thead className='border-b-2 border-slate-200'>
                                                            <th className='border px-2 border-slate-300'>Name</th>
                                                            <th className='border px-2 border-slate-300'>Phone Number</th>
                                                            <th className='border px-2 border-slate-300'>Email</th>
                                                            <th className='border px-2 border-slate-300'>Role</th>
                                                            <th className='border px-2 border-slate-300'>Action</th>
                                                        </thead>
                                                        <tbody  >
                                                            {props?.employees?.map((emp, i) => (
                                                                <tr key={i}>
                                                                    <td className='border px-2 border-slate-300'>{emp?.user?.name}</td>
                                                                    <td className='border px-2 border-slate-300'>{emp?.user?.phone_number}</td>
                                                                    <td className='border px-2 border-slate-300'>{emp?.user?.email}</td>
                                                                    <td className='border px-2 border-slate-300'>{emp?.role}</td>
                                                                    <td className='border px-2 border-slate-300'>
                                                                        <div className='flex gap-x-2'>
                                                                            <div className='px-2 bg-slate-300 my-1 rounded-md' onClick={() => { setShowModal(true) }}>Delete</div>

                                                                            <div className='px-2 bg-slate-300 my-1 rounded-md' onClick={() => {
                                                                                setShowModal(true); setItem({
                                                                                    name: emp.user.name, email: emp.user.email, phone_number: emp.user.phone_number, id: emp.user._id
                                                                                })
                                                                            }}>Edit</div>
                                                                            <div className='px-2 bg-slate-300 my-1 rounded-md' onClick={() => {
                                                                                props.make_super(emp?._id)
                                                                            }}>Make Super</div>

                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                </div>
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
            }
            <Add_admin
                show={showModal}
                changeInput={(e) => changeInput(e)}
                item={item}
                submit={() => submit()}
                toggle={() => { setShowModal(false); setItem(initialState) }}
            />
        </>
    );
};

export default Manage