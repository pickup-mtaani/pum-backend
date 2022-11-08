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
            <div style={{ border: 'gray 1px solid' }}>
                <div style={{ display: 'flex', borderBottom: 'gray 1px solid', width: "auto" }}>
                    <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        #NO
                    </div>
                    <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Sender Details
                    </div>
                    {/* <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Shelf Details
                    </div> */}
                    <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Package Details
                    </div>
                    <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Created
                    </div>
                    <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Recieved
                    </div>

                    <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        Collected
                    </div>


                </div>
                {props.data.map((rent, i) => (
                    <div style={{ display: 'flex', borderBottom: 'gray 1px solid', }} key={i}>
                        <div style={{ backgroundColor: 'green', width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {rent?.package?.receipt_no}
                            </div>
                        </div>
                        <div style={{ backgroundColor: 'green', width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Name:{rent?.package?.customerName}</div>
                                <div>No: {rent?.package?.customerPhoneNumber}</div>
                                <div>color:{rent?.package?.color}</div>

                            </div>

                        </div>

                        <div style={{ backgroundColor: 'green', width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Name:{rent?.package?.packageName}</div>
                                <div>Color: {rent?.package?.color}</div>
                                <div>Business:{rent?.package?.businessId?.name}</div>
                                <div>Payment: {rent?.package?.payment_status}</div>
                            </div>

                        </div>
                        <div style={{ backgroundColor: rent?.created ? 'green' : null, width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {moment(rent?.created).fromNow()}
                            </div>

                        </div>
                        <div style={{ backgroundColor: rent?.collectedAt ? 'green' : null, width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            {rent?.droppedAt && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Dropped at: {moment(rent?.droppedAt).fromNow()}</div>
                                <>Delivered to:{rent?.package?.senderAgentID?.business_name}</>
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

