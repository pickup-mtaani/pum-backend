import React, { useEffect, useState } from 'react'
import Layout from '../views/Layouts'
import { connect } from 'react-redux'
import DashboardItems from './DashboardItems'

import { FetchAdmins, FetchUsers } from '../redux/actions/auth.actions'
function Dashboard(props) {
    const dataItems = [
        {
            title: 'Todays Complete deliveries',
            value: 10,
            icon: <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        },
        {
            title: 'Amins', value: props.admins?.length,
            icon: <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        },
        {
            title: 'Total sellers', value: props.users?.length,
            icon: <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        },
        {
            title: 'total sellers today',
            value: props.users?.filter(seller => seller.createdAt === Date.today).length,
            icon: <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
        },
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
        users: state.userDetails.users,
        // packages: state.PackageDetails.packages
    }

};

export default connect(mapStateToProps, { FetchAdmins, FetchUsers })(Dashboard);
