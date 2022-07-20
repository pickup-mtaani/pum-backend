import React from 'react'

function DashboardItems(props) {
    return (
        <div className="bg-white h-20 w-56  rounded-xl shadow-sm flex" key={props.key}>
            <div className="h-full w-4/6 ">
                <div className=" w-full flex flex-col p-3">
                    <h1 className="font-bold text-gray-400 text-xs">{props.item.title}</h1>
                    <h1 className="font-bold text-primary-500 text-xl">{props.item.value}<span className="font-semibold pl-10 text-xl text-red-600 text-gray-400"> {props.item.percent && props.item.percent}{props.item.percent ? "%" : null}</span></h1>
                </div>
            </div>
            <div className="h-full w-2/6 flex justify-center items-center">
                <div className="bg-gradient-to-l from-primary-600 to-primary-500  h-14 w-14 shadow-xl rounded-md flex justify-center items-center">
                    {props.item.icon}
                </div>
            </div>
        </div>
    )
}

export default DashboardItems