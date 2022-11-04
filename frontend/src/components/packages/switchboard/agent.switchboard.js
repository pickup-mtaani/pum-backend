import React, { } from 'react'

import { connect } from 'react-redux'
// import { get_riders, assignRider } from '../../redux/actions/riders.actions'
// import { getagentParcels, togglePayment } from '../../redux/actions/package.actions'
function Agent(props) {


    return (

        <div >
            <div style={{ border: 'gray 1px solid' }}>
                <div style={{ display: 'flex', borderBottom: 'gray 1px solid' }}>
                    <div style={{ width: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        #NO
                    </div>
                    <div style={{ width: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Sender Details
                    </div>
                    <div style={{ width: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Recipient Details
                    </div>
                    <div style={{ width: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Package Details
                    </div>
                    <div style={{ width: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Created
                    </div>
                    <div style={{ width: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Dropped
                    </div>
                    <div style={{ width: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Assigned Rider
                    </div>
                    <div style={{ width: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: 'gray 1px solid', marginRight: 1 }}>
                        Collected
                    </div>


                </div>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: '10%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            FGM-11713
                        </div>
                    </div>
                    <div style={{ width: '10%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            JOhn Cursoons
                        </div>
                        <div style={{ justifyContent: 'right', display: "flex", }}>
                            <div style={{ margin: 5, borderRadius: 20, backgroundColor: 'beige', width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                View More
                            </div>

                        </div>

                    </div>
                    <div style={{ width: '10%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            Smith Aulins
                        </div>
                        <div style={{ justifyContent: 'right', display: "flex", }}>
                            <div style={{ margin: 5, borderRadius: 20, backgroundColor: 'beige', width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                View More
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '10%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            Red Dress
                        </div>
                        <div style={{ justifyContent: 'right', display: "flex", }}>
                            <div style={{ margin: 5, borderRadius: 20, backgroundColor: 'beige', width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                View Details
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '10%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            4hrs ago
                        </div>
                        <div style={{ justifyContent: 'right', display: "flex", }}>
                            <div style={{ margin: 5, borderRadius: 20, backgroundColor: 'beige', width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                View Details
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '10%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            2hrs ago
                        </div>
                        <div style={{ justifyContent: 'right', display: "flex", }}>
                            <div style={{ margin: 5, borderRadius: 20, backgroundColor: 'beige', width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                View Details
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '10%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            1hrs ago
                        </div>
                        <div style={{ justifyContent: 'right', display: "flex", }}>
                            <div style={{ margin: 5, borderRadius: 20, backgroundColor: 'beige', width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                View Details
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '10%', display: 'flex', flexDirection: 'column', marginRight: 1, borderRight: 'gray 1px solid', }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            30min ago
                        </div>
                        <div style={{ justifyContent: 'right', display: "flex", }}>
                            <div style={{ margin: 5, borderRadius: 20, backgroundColor: 'beige', width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                View Details
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <DataTable
                title=" Agent to Agent Delivery"
                columns={delivery_columns}
                data={data1}
                pagination
                paginationServer
                progressPending={props.loading}
                conditionalRowStyles={conditionalRowStyles}
                paginationResetDefaultPage={resetPaginationToggle}
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
                expandableRowExpanded={row => row.defaultExpanded}
                // onChangePage={handlePageChange}
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
            />
            <PackageDetail
                show={showModal}
                data={item}
                riders={props.riders}
                fetch={() => fetch()}
                loading={props.loading}
                // changeInput={(e) => changeInput(e)}
                // submit={() => submit()}
                toggle={() => setShowModal(false)}
            /> */}
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

