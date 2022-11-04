import moment from 'moment';
import React, { useState } from 'react'

import { connect } from 'react-redux'
import Details_modal from './detailsModal';
// import { get_riders, assignRider } from '../../redux/actions/riders.actions'
// import { getagentParcels, togglePayment } from '../../redux/actions/package.actions'
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
                    <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Sender Details
                    </div>
                    {/* <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Shelf Details
                    </div> */}
                    <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Package Details
                    </div>
                    <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Created
                    </div>
                    <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Recieved
                    </div>

                    <div style={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        Collected
                    </div>


                </div>
                {props.data.map((rent, i) => (
                    <div style={{ display: 'flex' }} key={i}>
                        <div style={{ backgroundColor: 'green', width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {rent?.package?.receipt_no}
                            </div>
                        </div>
                        <div style={{ backgroundColor: 'green', width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {rent?.package?.customerName}
                            </div>
                            <div style={{ justifyContent: 'right', display: "flex", }}>
                                <div style={{ margin: 5, borderRadius: 20, backgroundColor: 'beige', width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    View More
                                </div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'green', width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {rent?.package?.packageName}
                            </div>
                            <div style={{ justifyContent: 'right', display: "flex", }}>
                                <div onClick={() => openPack(rent?.package)} style={{ margin: 5, borderRadius: 20, backgroundColor: 'beige', width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    View Details
                                </div>
                            </div>
                        </div>
                        <div style={{ backgroundColor: rent?.created ? 'green' : null, width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {moment(rent?.created).fromNow()}
                            </div>

                        </div>
                        <div style={{ backgroundColor: rent?.collectedAt ? 'green' : null, width: '20%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {moment(rent?.droppedAt).fromNow()}
                            </div>
                            <div style={{ justifyContent: 'right', display: "flex", }}>
                                <div style={{ margin: 5, borderRadius: 20, backgroundColor: 'beige', width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    View Details
                                </div>
                            </div>
                        </div>
                        <div style={{ backgroundColor: rent?.collectedAt ? 'green' : null, width: '20%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                {moment(rent?.collectedAt).fromNow()}
                            </div>
                            <div style={{ justifyContent: 'right', display: "flex", }}>
                                <div style={{ margin: 5, borderRadius: 20, backgroundColor: 'beige', width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => openCollector(rent?.collectedby)}>
                                    View Details
                                </div>
                            </div>
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
        </div>
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

