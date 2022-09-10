import React, { useState } from 'react'
import DataTable from 'react-data-table-component';
import { get_riders, assignRider } from '../../redux/actions/riders.actions'
import { connect } from 'react-redux'
function AssignRiderModal(props) {
    const { toggle, show, data } = props
    const [rider, setRider] = useState("")
    const [showModal, setShowModal] = useState(false);
    const changeInput = async (e) => {
        const { value } = e.target;
        const data1 = { package: props.data._id, rider: value }
        props.assignRider(data1)
        setRider(value);
        toggle(false)
    };
    return (

        <>

            {
                show ? (
                    <>

                        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none min-width:screen">
                            <div className="relative w-full h-full rounded-sm my-6 mx-auto max-w-xl  ">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                                        <h3 className="text-xl font=bold uppercase">Assign Rider </h3>
                                        <button
                                            className="bg-transparent border-0 text-black float-right"
                                            onClick={props.toggle}
                                        >
                                            <span className="text-black opacity-7 h-6 w-6 text-xl  py-0 rounded-full flex justify-center items-center">
                                                x
                                            </span>
                                        </button>
                                    </div>
                                    <div className="relative p-6 flex justify-center items-center">
                                        <select name="gender" onChange={changeInput} className="bg-transparent border-b border-slate-500 pt-5 pb-5 ">
                                            <option value="">Selected Rider</option>
                                            {props.riders.map((rider, i) => (
                                                <option key={i} value={rider._id} onChange={changeInput}>{rider.rider_name}</option>
                                            ))}

                                        </select>
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
export default connect(mapStateToProps, { get_riders, assignRider })(AssignRiderModal)