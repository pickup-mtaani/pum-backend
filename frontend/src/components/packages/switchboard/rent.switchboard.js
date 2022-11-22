import moment from 'moment';
import React, { useState } from 'react'

import { connect } from 'react-redux'
import Details_modal from './detailsModal';
function Agent(props) {
    const [showModal, setShowModal] = useState(false)
    const [component, setComponent] = useState(<></>)
    const [title, setTitle] = useState('')

    const openCollector = (item) => {
        setTitle("Collected By")
        setShowModal(true)
        setComponent(
            <div className="w-full flex flex-col gap-y-2 ">
                <div className="flex  gap-x-10">
                    <div className="w-24">Name</div>
                    <input type="text" disabled className=" px-2 border border-slate-200 w-full py-2 rounded-md" value={item.collector_name} name="name" />
                </div>
                <div className="flex  gap-x-10">
                    <div className="w-24">Phone</div>
                    <input type="text" disabled className=" px-2 border border-slate-200 w-full py-2 rounded-md" value={item.collector_phone_number} name="phone_number" />
                </div>


            </div>
        )
    }
    const openPack = (item) => {
        setTitle(item.receipt_no)
        setShowModal(true)
        setComponent(
            <div className="w-full flex flex-col gap-y-2 ">
                <div className="flex  gap-x-10">
                    <div className="w-24">Name</div>
                    <input type="text" disabled className=" px-2 border border-slate-200 w-full py-2 rounded-md" value={item.packageName} name="name" />
                </div>
                <div className="flex  gap-x-10">
                    <div className="w-24">Color</div>
                    <input type="text" disabled className=" px-2 border border-slate-200 w-full py-2 rounded-md" value={item.color} name="phone_number" />
                </div>
                <div className="flex  gap-x-10">
                    <div className="w-24">Bussiness</div>
                    <input type="text" disabled className=" px-2 border border-slate-200 w-full py-2 rounded-md" value={item.businessId.name} name="phone_number" />
                </div>


            </div>
        )
    }

    return (

        <div >
            <table>
                <thead>
                    <tr className='gap-x-2 p-y-10' style={{ backgroundColor: 'green' }}>

                        <th className='border text-20 text-bold p-5'>
                            Reciever Details
                        </th>
                        <th className='border text-20 text-bold p-5'>
                            Package Details
                        </th>
                        <th className='border text-20 text-bold p-5'>
                            Created
                        </th>
                        <th className='border text-20 text-bold p-5'>
                            Dropped
                        </th>
                        <th className='border text-20 text-bold p-5'>
                            Collected
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {props?.data?.map((rent, i) => (<tr className='gap-x-2 p-y-10'>

                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: 'green' }}>
                            <div>Name:{rent?.package?.customerName}</div>
                            <div>No: {rent?.package?.customerPhoneNumber}</div>
                        </td>
                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: 'green' }}>
                            <div>Name:{rent?.package?.packageName}</div>
                            <div>Reciept:{rent?.package?.receipt_no}</div>
                            <div>Value: {rent?.package?.package_value}</div>
                            <div>Color: {rent?.package?.color}</div>
                            <div>Business:{rent?.package?.businessId?.name}</div>
                            <div>Payment: {rent?.package?.payment_status}</div>
                            <div>Sent From: {rent?.package?.senderAgentID?.business_name}</div>
                            <div>Sent To: {rent?.package?.receieverAgentID?.business_name}</div>
                        </td>
                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: 'green' }}>
                            {rent?.created &&
                                moment(rent?.created).format("yyyy-MM-dd HH:mm:ss")}

                        </td>
                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: rent?.droppedAt ? 'green' : null, }}>
                            {rent?.droppedAt && <div >
                                <div>Dropped at: {moment(rent?.droppedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Delivered to:{rent?.package?.senderAgentID?.business_name}</div>
                            </div>}
                        </td>

                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: rent?.collectedAt ? 'green' : null, }}>
                            {rent?.collectedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Collected: {moment(rent?.collectedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Collected By:{rent?.collectedby?.collector_name}</div>
                                <div>Collector's Phone :{rent?.collectedby?.collector_phone_number}</div>
                            </div>}
                        </td>
                    </tr>))}
                </tbody>
            </table>


            <Details_modal
                show={showModal}
                component={component}
                title={title}
                toggle={() => setShowModal(false)}
            />
        </div >
    )
}


const mapStateToProps = (state) => {
    return {
        riders: state.ridersDetails.riders,
        packages: state.PackageDetails.packages,
        loading: state.PackageDetails.agentloading,

    };
};

export default connect(mapStateToProps, {})(Agent)

