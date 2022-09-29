import React from 'react'
import { Link } from 'react-router-dom'

import Layout from '../../views/Layouts'
import { DashboardWHItem } from '../DashboardItems'
function index() {
    return (
        <Layout>
            <div className='flex w-full gap-x-20 '>
                <DashboardWHItem obj={{ title: 'Collect From Riders', value: 0, }} />
                <DashboardWHItem obj={{ title: 'Assign to Riders', value: 0, }} />
            </div>
            <div className='flex w-full gap-x-20 mt-20'>
                <DashboardWHItem obj={{ title: 'Collect Doorstep from Riders', value: 0, }} />
                <DashboardWHItem obj={{ title: 'Assign Doorstep to Riders', value: 0, }} />
            </div>



        </Layout>
    )
}

export default index