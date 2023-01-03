import moment from 'moment';
import React, { useState } from 'react'

import { connect } from 'react-redux'
import Details_modal from './detailsModal';
function Agent(props) {
    const [showModal, setShowModal] = useState(false)
    const [component, setComponent] = useState(<div></div>)
    const [title, setTitle] = useState('')


    return (

        <div >
            <table>
                <thead>
                    <tr className='gap-x-2 p-y-10' style={{ backgroundColor: '#00E676' }}>
                        <th className='border text-20 text-bold p-5'>
                            Sender Details
                        </th>
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
                            picked from Sender
                        </th>

                        <th className='border text-20 text-bold p-5'>
                            assign rider
                        </th>
                        <th className='border text-20 text-bold p-5'>
                            rider accepted
                        </th>
                        <th className='border text-20 text-bold p-5'>
                            Dropped warehouse
                        </th>

                        <th className='border text-20 text-bold p-5'>
                            Warehouse  Rider
                        </th>


                        <th className='border text-20 text-bold p-5'>
                            Rider Dropped at Destination agent
                        </th>


                        <th className='border text-20 text-bold p-5'>
                            Collected
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {props?.data?.map((rent, i) => (<tr className='gap-x-2 p-y-10'>
                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: '#00E676' }}>
                            <div> {rent?.package?.senderAgentID?.business_name}</div>
                            <div> {rent?.package?.senderAgentID?.location_id.name}</div>
                            <div className='bg-primary-500 p-2 text-center rounded-sm shadow-5' onClick={() => setShowModal(true)}>Edit</div>
                        </td>
                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: '#00E676' }}>
                            <div>{rent?.package?.customerName}</div>
                            <div>{rent?.package?.customerPhoneNumber}</div>
                        </td>
                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: '#00E676' }}>
                            <div>Name:{rent?.package?.packageName}</div>
                            <div>Reciept:{rent?.package?.receipt_no}</div>
                            <div>Value: {rent?.package?.package_value}</div>
                            <div>Color: {rent?.package?.color}</div>
                            <div>Business:{rent?.package?.businessId?.name}</div>
                            <div>Payment: {rent?.package?.payment_status}</div>
                            <div>Sent From: {rent?.package?.senderAgentID?.business_name}</div>
                            <div>Sent To: {rent?.package?.receieverAgentID?.business_name}</div>
                        </td>
                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: '#00E676' }}>
                            {rent?.created &&
                                moment(rent?.created).format("yyyy-MM-dd HH:mm:ss")}

                        </td>
                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: rent?.dropped?.droppedAt ? '#00E676' : null, }}>
                            {rent?.dropped?.droppedAt && <div >
                                <div>Dropped at: {moment(rent?.dropped?.droppedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Delivered to:{rent?.package?.senderAgentID?.business_name}</div>
                            </div>}
                        </td>

                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: rent.assigned?.assignedAt ? '#00E676' : null, }}>
                            {rent?.assigned?.assignedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Assigned At: {moment(rent?.assignedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Rider:{rent?.package?.assignedTo.name}</div>
                                <div>Rider Phone :{rent?.package?.assignedTo.phone_number}</div>
                            </div>}
                        </td>
                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: rent.accepted?.acceptedAt ? '#00E676' : null, }}>
                            {rent?.accepted?.acceptedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Confirmed At: {moment(rent?.acceptedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Rider:{rent?.package?.assignedTo.name}</div>
                                {/* <div>Rider Phone :{rent?.package?.assignedTo.phone_number}</div> */}
                            </div>}
                        </td>
                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: rent?.warehouse?.warehouseAt ? '#00E676' : null, }}>
                            {rent?.warehouse?.warehouseAt && <div style={{ display: rent?.warehouseAt ? 'flex' : "none", justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {moment(rent?.warehouse?.warehouseAt).format("yyyy-MM-dd HH:mm:ss")}
                            </div>}
                        </td>

                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: rent?.reassignedAt ? '#00E676' : null, }}>
                            {rent?.reassignedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Re Assigned at: {moment(rent?.reassignedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Rider:{rent?.package?.assignedTo.name}</div>
                                <div>Rider Phone :{rent?.package?.assignedTo?.phone_number}</div>
                            </div>}
                        </td>


                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: rent?.droppedToagentAt ? '#00E676' : null, }}>
                            {rent?.droppedToagentAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Delivered at: {moment(rent?.droppedToagentAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Delivered to:{rent?.package?.receieverAgentID?.business_name}</div>
                            </div>}
                        </td>


                        <td className='border text-20 text-bold p-5' style={{ backgroundColor: rent?.collectedAt ? '#00E676' : null, }}>
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

{/* <div style={{ display: 'flex', borderBottom: 'gray 1px solid' }}>
<div style={header}>
    #NO
</div>
<div style={header}>
    Sender Details
</div>
<div style={header}>
    Shelf Details
</div>
<div style={header}>
    Package Details
</div>
<div style={header}>
    Created
</div>
<div style={header}>
    Recieved
</div>

<div style={header}>
    Assigned
</div>
<div style={header}>
    Dropped to warehouse
</div>
<div style={header}>
    Reassigned
</div>
<div style={header}>
    Delivered
</div>

<div style={{ width: '0%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    Collected
</div>


</div> */}