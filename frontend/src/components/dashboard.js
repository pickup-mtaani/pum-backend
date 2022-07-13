import React from 'react'
import Layout from '../views/Layouts'

function Dashboard() {
    const dataItems = [
        { title: 'Todays Complete deliveries' },
        { title: '1' },
        { title: '1' },
        { title: '1' },
        { title: '1' },
    ]
    return (
        <Layout>
            <div className='w-full h-20 '>
                <div className='flex gap-x-2 mx-5'>
                    {dataItems.map((item, i) => (
                        <div className="bg-white h-20 w-56  rounded-xl shadow-sm flex">
                            <div className="h-full w-4/6 ">
                                <div className=" w-full flex flex-col p-3">
                                    <h1 className="font-bold text-gray-400 text-xs">{item.title}</h1>
                                    <h1 className="font-bold text-primary-500 text-2xl">300<span className="font-semibold pl-10 text-xl text-red-600 text-gray-400">3%</span></h1>
                                </div>
                            </div>
                            <div className="h-full w-2/6 flex justify-center items-center">

                                <div className="bg-gradient-to-l from-primary-600 to-primary-500  h-14 w-14 shadow-xl rounded-md">

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full gap-x-10 mx-5 flex mt-10">
                    <div className="w-2/5 h-40 bg-green-100"></div>
                    <div className="w-2/5 h-40 bg-green-100"></div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard