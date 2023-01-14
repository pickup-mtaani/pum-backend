import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { get_riders } from '../../../redux/actions/riders.actions'
import { connect } from 'react-redux'
import Details_modal from './detailsModal';
function Agent(props) {
    const [showModal, setShowModal] = useState(false)
    const [showAgentChange, setShowagentChange] = useState(false)
    const [agent_id, setAgent] = useState(false)
    const [component, setComponent] = useState(<div></div>)
    const { fetch } = props
    const [title, setTitle] = useState('')
    const openchangeagent = (item) => {
        setTitle(`Edit ${item.packageName}\'s sender Agent`)
        setShowModal(true)
        setComponent(
            <div className="w-full flex flex-col gap-y-2 ">
                <div className="flex  gap-x-10">
                    <select className=" px-2 border border-slate-200 w-full py-2 rounded-md"
                        onChange={async (e) => { await props.update(item._id, { senderAgentID: e.target.value }); await fetch(); setShowModal(false) }}

                    >
                        <option value={item.senderAgentID._id}>{item.senderAgentID.business_name}</option>
                        {props?.agents?.map((agent, i) => (
                            <option key={i} value={agent._id} >{agent.business_name}</option>
                        ))}
                    </select>
                </div>

            </div>
        )
    }
    const openchangeRider = (item) => {
        setTitle(`Edit ${item.packageName}\'s Assigned Rider`)
        setShowModal(true)
        setComponent(
            <div className="w-full flex flex-col gap-y-2 ">
                <div className="flex  gap-x-10">
                    <select className=" px-2 border border-slate-200 w-full py-2 rounded-md"
                        onChange={async (e) => {
                            await props.update(item._id, { assignedTo: e.target.value });
                            await fetch(); setShowModal(false)
                        }}

                    >
                        <option value={item.senderAgentID._id}>{item.assignedTo.name}</option>
                        {props?.riders?.map((agent, i) => (
                            <option key={i} value={agent?.user?._id} >{agent?.user?.name}</option>
                        ))}
                    </select>
                </div>

            </div>
        )
    }
    const editReciever = (item) => {
        setTitle("Update Customer Details  ")
        setShowModal(true)
        setComponent(
            <div className="w-full flex flex-col gap-y-2 ">
                <div className="flex  gap-x-10">
                    <div className="w-24">Name</div>
                    <input type="text" disabled className=" px-2 border border-slate-200 w-full py-2 rounded-md" value={item.customerName} name="name" />
                </div>
                <div className="flex  gap-x-10">
                    <div className="w-24">Phone Number</div>
                    <input type="text" disabled className=" px-2 border border-slate-200 w-full py-2 rounded-md" value={item.customerPhoneNumber} name="phone_number" />
                </div>
                {/* <div className="flex  gap-x-10">
                    <div className="w-24">Bussiness</div>
                    <input type="text" disabled className=" px-2 border border-slate-200 w-full py-2 rounded-md" value={item.businessId.name} name="phone_number" />
                </div> */}


            </div>
        )
    }
    useEffect(() => {
        props.get_riders({ limit: 10 })
    }, [])

    console.log(props.riders)
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
                        <th className='border text-sm text-bold p-5 '>
                            Package Details
                        </th>
                        <th className='border text-sm text-bold p-5'>
                            Created
                        </th>
                        <th className='border text-sm text-bold p-5'>
                            picked from Sender
                        </th>

                        <th className='border text-sm text-bold p-5'>
                            assign rider
                        </th>
                        <th className='border text-sm text-bold p-5'>
                            rider accepted
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
                            <div> {rent?.package?.senderAgentID?.business_name}</div>
                            <div> {rent?.package?.senderAgentID?.location_id.name}</div>
                            <div className='bg-primary-500 p-1 text-center rounded-sm shadow-5' onClick={() => openchangeagent(rent.package)}>Edit</div>
                        </td>
                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: '#00E676' }}>
                            <div>{rent?.package?.customerName}</div>
                            <div>{rent?.package?.customerPhoneNumber}</div>
                            <div className='bg-primary-500 p-1 text-center rounded-sm shadow-5' onClick={() => editReciever(rent.package)}>Edit</div>

                        </td>
                        <td className='border text-sm p-5' style={{ backgroundColor: '#00E676' }}>
                            {/* <div>{rent?.package?.packageName}</div> */}
                            <div className='text-bold '>{rent?.package?.receipt_no}</div>
                            <div>Ksh{rent?.package?.package_value}</div>
                            <div> {rent?.package?.color}</div>
                            {/* <div>{rent?.package?.businessId?.name}</div>
                            <div> {rent?.package?.payment_status}</div>
                            <div>{rent?.package?.senderAgentID?.business_name}</div>
                            <div>{rent?.package?.receieverAgentID?.business_name}</div> */}
                        </td>
                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: '#00E676' }}>
                            {rent?.created &&
                                moment(rent?.created?.createdAt).format("yyyy-MM-dd HH:mm:ss")}
                        </td>
                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: rent?.dropped?.droppedAt ? '#00E676' : null, }}>
                            {rent?.dropped?.droppedAt && <div >
                                <div>Dropped at: {moment(rent?.dropped?.droppedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Delivered to:{rent?.package?.senderAgentID?.business_name}</div>
                            </div>}
                        </td>
                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: rent.assigned?.assignedAt ? '#00E676' : null, }}>
                            {rent?.assigned?.assignedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Assigned At: {moment(rent?.assignedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Rider:{rent?.package?.assignedTo?.name}</div>
                                <div>Rider Phone :{rent?.package?.assignedTo?.phone_number}</div>
                                <div className='bg-primary-500 p-1 text-center rounded-sm shadow-5'
                                    onClick={() => openchangeRider(rent.package)}>Edit</div>
                                {/* <div className='bg-primary-500 p-1 text-center rounded-sm shadow-5' onClick={() => openchangeagent(rent.package)}>Edit</div> */}


                            </div>}
                        </td>
                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: rent.accepted?.acceptedAt ? '#00E676' : null, }}>
                            {rent?.accepted?.acceptedAt ? <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Confirmed At: {moment(rent?.acceptedacceptedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Rider:{rent?.package?.assignedTo?.name}</div>

                                {/* <div>Rider Phone :{rent?.package?.assignedTo.phone_number}</div> */}
                            </div>
                                : <div className='bg-red-400 p-1 text-center rounded-sm shadow-5'
                                    style={{
                                        backgroundColor: rent?.package?.assignedTo === undefined && "transparent",
                                        color: rent?.package?.assignedTo === undefined && "transparent"
                                    }}
                                    onClick={async () => { await props.changeState(rent.package._id, "on-transit"); await fetch() }}>Rider {rent?.package?.assignedTo?.name} accepted</div>
                            }
                        </td>
                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: rent?.warehouse?.warehouseAt ? '#00E676' : null, }}>
                            {rent?.warehouse?.warehouseAt && <div style={{ display: rent?.warehouse?.warehouseAt ? 'flex' : "none", justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {moment(rent?.warehouse?.warehouseAt).format("yyyy-MM-dd HH:mm:ss")}
                            </div>}
                        </td>

                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: rent?.reAssigned?.reAssignedAt ? '#00E676' : null, }}>
                            {rent?.reAssigned?.reAssignedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Re Assigned at: {moment(rent?.reAssigned?.reAssignedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Rider:{rent?.package?.assignedTo?.name}</div>
                                <div>Rider Phone :{rent?.package?.assignedTo?.phone_number}</div>
                            </div>}
                        </td>


                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: rent?.droppedToagent?.recievedAt ? '#00E676' : null, }}>
                            {rent?.droppedToagent?.recievedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Delivered at: {moment(rent?.droppedToagent?.recievedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Delivered to:{rent?.package?.receieverAgentID?.business_name}</div>
                            </div>}
                        </td>


                        <td className='border text-sm text-bold p-5' style={{ backgroundColor: rent?.collected?.collectedAt ? '#00E676' : null, }}>
                            {rent?.collected?.collectedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Collected: {moment(rent?.collected?.collectedAt).format("yyyy-MM-dd HH:mm:ss")}</div>
                                <div>Collected By:{rent?.collected?.collectedby?.collector_name}</div>
                                <div>Collector's Phone :{rent?.collected?.collectedby?.collector_phone_number}</div>
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

export default connect(mapStateToProps, { get_riders })(Agent)

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