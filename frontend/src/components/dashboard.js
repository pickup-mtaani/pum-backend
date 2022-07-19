import React, { useEffect, useState } from 'react'
import Layout from '../views/Layouts'
import { connect } from 'react-redux'
import DashboardItems from './DashboardItems'
import Modal from './common/modal'
import { FetchAdmins, FetchUsers } from '../redux/actions/auth.actions'
function Dashboard(props) {
    const dataItems = [
        { title: 'Todays Complete deliveries', value: 10 },
        { title: 'Amins', value: 20 },
        { title: '1' },
        { title: '1' },
        { title: '1' },
    ]

    useEffect(() => {
        props.FetchUsers()
    }, [])

    return (
        <Layout>
            <div className='w-full h-20 '>
                <div className='flex gap-x-2 mx-5'>
                    {dataItems.map((item, i) => (
                        <DashboardItems item={item} key={i} />
                    ))}
                </div>
                <div className="w-full gap-x-10 mx-5 flex mt-10">
                    {/* <div className="w-2/5 h-40 bg-green-100"></div>
                    <div className="w-2/5 h-40 bg-green-100"></div> */}
                </div>
            </div>

        </Layout>
    )
}


const mapStateToProps = (state) => {
    return {
        error: state.userDetails.error,
        user: state.userDetails.user,
        admins: state.userDetails.admins,
        // packages: state.PackageDetails.packages
    }

};

export default connect(mapStateToProps, { FetchAdmins, FetchUsers })(Dashboard);
