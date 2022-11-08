import moment from 'moment';
import React, { useState } from 'react'

import { connect } from 'react-redux'
import Details_modal from './detailsModal';
function Agent(props) {
    const [showModal, setShowModal] = useState(false)
    const [component, setComponent] = useState(<div></div>)
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
    const header = { width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }
    return (

        <div >
            <div style={{ border: 'gray 1px solid' }}>
                <div style={{ display: 'flex', borderBottom: 'gray 1px solid', }} >
                    <div style={{ backgroundColor: 'green', width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            Reciept
                        </div>
                    </div>
                    <div style={{ backgroundColor: 'green', width: '30%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            Customer Details
                        </div>

                    </div>

                    <div style={{ backgroundColor: 'green', width: '30%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                        Package Details

                    </div>
                    <div style={{ width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                        Created At

                    </div>
                    <div style={{ width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                        Dropped At
                    </div>
                    <div style={{ width: '30%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                        Assigned
                    </div>
                    <div style={{ width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                        Dropped at ware House
                    </div>
                    <div style={{ width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                        Dispatched ware House
                    </div>
                    <div style={{ width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                        Delivered To
                    </div>
                    <div style={{ width: '20%', display: 'flex', flexDirection: 'column' }}>
                        Collected
                    </div>

                </div>
                {props?.data?.map((rent, i) => (
                    <div style={{ display: 'flex', borderBottom: 'gray 1px solid', }} key={i}>
                        <div style={{ backgroundColor: 'green', width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {rent?.package?.receipt_no}
                            </div>
                        </div>
                        <div style={{ backgroundColor: 'green', width: '30%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {rent?.package?.customerName}({rent?.package?.customerphonumber})
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'green', width: '30%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Name:{rent?.package?.packageName}</div>
                                <div>Color: {rent?.package?.color}</div>
                                <div>Business:{rent?.package?.businessId?.name}</div>
                                <div>Payment: {rent?.package?.payment_status}</div>
                            </div>
                        </div>
                        <div style={{ backgroundColor: rent?.created ? 'green' : null, width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                            {rent?.created && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {moment(rent?.created).fromNow()}
                            </div>}

                        </div>
                        <div style={{ backgroundColor: rent?.droppedAt ? 'green' : null, width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                            {rent?.droppedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Dropped at: {moment(rent?.droppedAt).fromNow()}</div>
                                <div>Delivered to:{rent?.package?.senderAgentID?.business_name}</div>
                            </div>}

                        </div>
                        <div style={{ backgroundColor: rent?.assignedAt ? 'green' : null, width: '30%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                            {rent?.assignedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Dispatched: {moment(rent?.assignedAt).fromNow()}</div>
                                <div>Rider:{rent?.package?.assignedTo.name}</div>
                                <div>Rider Phone :{rent?.package?.assignedTo.phone_number}</div>
                            </div>}

                        </div>
                        <div style={{ backgroundColor: rent?.warehouseAt ? 'green' : null, width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            {rent?.warehouseAt && <div style={{ display: rent?.droppedAt ? 'flex' : "none", justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {moment(rent?.warehouseAt).fromNow()}
                            </div>}

                        </div>
                        <div style={{ backgroundColor: rent?.reassignedAt ? 'green' : null, width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                            {rent?.reassignedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Re Assigned at: {moment(rent?.reassignedAt).fromNow()}</div>
                                <div>Rider:{rent?.package?.assignedTo.name}</div>
                                <div>Rider Phone :{rent?.package?.assignedTo?.phone_number}</div>
                            </div>}

                        </div>
                        <div style={{ backgroundColor: rent?.droppedToagentAt ? 'green' : null, width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                            {rent?.droppedToagentAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Delivered at: {moment(rent?.droppedToagentAt).fromNow()}</div>
                                <div>Delivered to:{rent?.package?.receieverAgentID?.business_name}</div>
                            </div>}
                        </div>
                        <div style={{ backgroundColor: rent?.collectedAt ? 'green' : null, display: rent?.collectedAt ? 'flex' : null, width: '20%', display: 'flex', flexDirection: 'column' }}>

                            {rent?.collectedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Collected: {moment(rent?.collectedAt).fromNow()}</div>
                                <div>Collected By:{rent?.collectedby?.collector_name}</div>
                                <div>Collector's Phone :{rent?.collectedby?.collector_phone_number}</div>
                            </div>}
                        </div>

                    </div>
                ))}
            </div>
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