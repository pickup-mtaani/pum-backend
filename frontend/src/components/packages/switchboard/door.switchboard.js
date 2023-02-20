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
                    <tr className='gap-x-2 p-y-10' style={{ backgroundColor: '#00E676' }}>
                        <th className='border text-sm text-bold p-5'>
                            Sender Details
                        </th>
                        <th className='border text-sm text-bold p-5'>
                            Reciever Details
                        </th>
                        <th className='border text-sm text-bold p-5'>
                            Package Details
                        </th>
                        <th className='border text-sm text-bold p-5'>
                            Created
                        </th>
                        <th className='border text-sm text-bold p-5'>
                            Agent Rider
                        </th>
                        <th className='border text-sm text-bold p-5'>
                            Rider Picked
                        </th>
                        <th className='border text-sm text-bold p-5'>
                            Dropped warehouse
                        </th>

                        <th className='border text-sm text-bold p-5'>
                            Warehouse  Rider
                        </th>


                        <th className='border text-sm text-bold p-5'>
                            Rider Dropped at Destination agent
                        </th>


                        <th className='border text-sm text-bold p-5'>
                            Collected
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {props?.data?.map((rent, i) => (<tr className='gap-x-2 p-y-10'>
                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: '#00E676' }}>
                            Sender Details
                        </td>
                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: '#00E676' }}>
                            <div>Name:{rent?.package?.customerName}</div>
                            <div>No: {rent?.package?.customerPhoneNumber}</div>
                        </td>
                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: '#00E676' }}>
                            <div>Name:{rent?.package?.packageName}</div>
                            <div>Reciept:{rent?.package?.receipt_no}</div>
                            <div>Value: {rent?.package?.package_value}</div>
                            <div>Color: {rent?.package?.color}</div>
                            <div>Business:{rent?.package?.businessId?.name}</div>
                            <div>Payment: {rent?.package?.payment_status}</div>
                            <div>Sent From: {rent?.package?.senderAgentID?.business_name}</div>
                            <div>Sent To: {rent?.package?.receieverAgentID?.business_name}</div>
                        </td>
                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: '#00E676' }}>
                            {rent?.created &&
                                moment(rent?.created).format("yyyy-mm-ddd HH:mm:ss")}

                        </td>
                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: rent?.droppedAt ? '#00E676' : null, }}>
                            {rent?.droppedAt && <div >
                                <div>Dropped at: {moment(rent?.droppedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Delivered to:{rent?.package?.senderAgentID?.business_name}</div>
                            </div>}
                        </td>
                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: rent?.assignedAt ? '#00E676' : null, }}>
                            {rent?.assignedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Dispatched: {moment(rent?.assignedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Rider:{rent?.package?.assignedTo?.name}</div>
                                <div>Rider Phone :{rent?.package?.assignedTo.phone_number}</div>
                            </div>}
                        </td>
                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: rent?.droppedAt ? '#00E676' : null, }}>
                            {rent?.warehouseAt && <div style={{ display: rent?.droppedAt ? 'flex' : "none", justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {moment(rent?.warehouseAt).format("yyyy-MM-dd HH:mm:ss")}
                            </div>}
                        </td>

                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: rent?.reassignedAt ? '#00E676' : null, }}>
                            {rent?.reassignedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Re Assigned at: {moment(rent?.reassignedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Rider:{rent?.package?.assignedTo?.name}</div>
                                <div>Rider Phone :{rent?.package?.assignedTo?.phone_number}</div>
                            </div>}
                        </td>


                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: rent?.droppedToagentAt ? '#00E676' : null, }}>
                            {rent?.droppedToagentAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Delivered at: {moment(rent?.droppedToagentAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Delivered to:{rent?.package?.receieverAgentID?.business_name}</div>
                            </div>}
                        </td>


                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: rent?.collectedAt ? '#00E676' : null, }}>
                            {rent?.collectedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Collected: {moment(rent?.collectedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Collected By:{rent?.collectedby?.collector_name}</div>
                                <div>Collector's Phone :{rent?.collectedby?.collector_phone_number}</div>
                            </div>}
                        </td>
                    </tr>))}
                </tbody>
            </table>

            {/* <div style={{ border: 'gray 1px solid' }}>
                <div style={{ display: 'flex', borderBottom: 'gray 1px solid', width: "auto", }}>
                    <div style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid' }}>
                        #NO
                    </div>
                    <div style={{ minWidth: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid' }}>
                        Sender Details
                    </div>
                   
                    <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid' }}>
                        Package Details
                    </div>
                    <div style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid' }}>
                        Created
                    </div>
                    <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid' }}>
                        Recieved
                    </div>

                    <div style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid' }}>
                        Assigned
                    </div>
                    <div style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid' }}>
                        Dropped to warehouse
                    </div>
                    <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid' }}>
                        Reassigned
                    </div>
                   

                    <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        Collected
                    </div>


                </div>
                {props?.data?.map((rent, i) => (
                    <div style={{ display: 'flex', borderBottom: 'gray 1px solid', color: '#f5f5f5' }} key={i}>
                        <div style={{ backgroundColor: '#00E676', width: '30%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            <div className='flex justify-center items-center align-center p-5'>
                                {rent?.package?.receipt_no}
                            </div>
                        </div>
                        <div style={{ backgroundColor: '#00E676', minWidth: '10%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }} className="gap-y-2 px-4 py-2">
                                <div>Name:{rent?.package?.customerName}</div>
                                <div>No: {rent?.package?.customerPhoneNumber}</div>
                            </div>

                        </div>

                        <div style={{ backgroundColor: '#00E676', width: '50%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }} className="gap-y-2 px-4 py-2">
                                <div>Name:{rent?.package?.packageName}</div>
                                <div>Color: {rent?.package?.color}</div>
                                <div>Business:{rent?.package?.businessId?.name}</div>
                                <div>Sent To:{rent?.package?.destination?.name}</div>
                                <div>Sent Through: {rent?.package?.agent?.business_name}</div>
                                <div>Payment: {rent?.package?.payment_status}</div>
                            </div>
                        </div>
                        <div style={{ backgroundColor: rent?.created ? '#00E676' : null, width: '30%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                            <div className='flex justify-center items-center align-center p-5'>
                                {moment(rent?.created).format("yyyy-MM-dd HH:mm:ss")}
                            </div>

                        </div>
                        <div style={{ backgroundColor: rent?.droppedAt ? '#00E676' : null, width: '50%', display: 'flex', flexDirection: 'column', borderRight: 'gray 1px solid', }}>
                            {rent?.droppedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Dropped at: {moment(rent?.droppedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Delivered to:{rent?.package?.agent?.business_name}</div>
                            </div>}
                        </div>
                        <div style={{ backgroundColor: rent?.assignedAt ? '#00E676' : null, width: '30%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            {rent?.assignedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Dispatched at: {moment(rent?.assignedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Rider:{rent?.package?.assignedTo?.name}</div>
                                <div>Rider Phone :{rent?.package?.assignedTo.phone_number}</div>
                            </div>}
                        </div>
                        <div style={{ backgroundColor: rent?.warehouseAt ? '#00E676' : null, width: '30%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            {rent?.warehouseAt && <div style={{ display: rent?.droppedAt ? 'flex' : "none", justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {moment(rent?.warehouseAt).format("yyyy-MM-dd HH:mm:ss")}
                            </div>}

                        </div>
                        <div style={{ backgroundColor: rent?.reassignedAt ? '#00E676' : null, width: '50%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            {rent?.reassignedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Re Assigned at: {moment(rent?.reassignedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Rider:{rent?.package?.assignedTo?.name}</div>
                                <div>Rider Phone :{rent?.package?.assignedTo?.phone_number}</div>
                            </div>}
                        </div>
                        
                        <div style={{ backgroundColor: rent?.collectedAt ? '#00E676' : null, display: rent?.collectedAt ? 'flex' : null, width: '50%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            {rent?.collectedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Collected: {moment(rent?.collectedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Collected By:{rent?.collectedby?.collector_name}</div>
                                <div>Collector's Phone :{rent?.collectedby?.collector_phone_number}</div>
                            </div>}
                        </div>

                    </div>
                ))}
            </div> */}
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

