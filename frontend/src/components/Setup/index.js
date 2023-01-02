import React, { useEffect } from 'react'
import { useState } from 'react'
import Layout from '../../views/Layouts'

import Doorstepsestinations from './Doorstepsestinations'

function Setup(props) {

    const [tab, setTab] = useState("sent")
    const [data1, setData] = useState([])




    return (
        <Layout>
            <div className='w-full p-2 flex flex-wrap border-b border-slate-400 gap-x-1'>
                <div className='md:w-1/6 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center' onClick={async () => { setTab('sent'); }} style={{ backgroundColor: tab === "sent" && "gray" }} >
                    Doorstep Pricing
                </div>

                <div className='md:w-1/6 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center' onClick={async () => { setTab('collected') }} style={{ backgroundColor: tab === "collected" && "gray" }} >
                    Agent-zones pricing
                </div>
                <div className='md:w-1/6 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center' onClick={async () => { setTab('shelf') }} style={{ backgroundColor: tab === "shelf" && "gray" }} >
                    Door Packages
                </div>
                <div className='md:w-1/6 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center' onClick={async () => { setTab('pending-agent') }} style={{ backgroundColor: tab === "pending-agent" && "gray" }} >
                    Rent A Shelf Packages
                </div>
            </div>
            {tab === "sent" && <div className=" mx-2 my-10">
                <Doorstepsestinations />
            </div>}

            {tab === "shelf" && <div className=" mx-2 my-10">
                <Doorstepsestinations />
            </div>}
            {tab === "pending-agent" && <div className=" mx-2 my-10">
                <Doorstepsestinations />
            </div>}
            {tab === "collected" && <div className=" mx-2 my-10">
                <Doorstepsestinations />
            </div>}
        </Layout >
    )
}


export default Setup

