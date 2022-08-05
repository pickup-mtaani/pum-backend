import React from 'react'
import { Link } from 'react-router-dom'

function DashboardItems(props) {
    const { item } = props
    return (
        <div className="bg-white h-20 w-56  rounded-xl shadow-sm flex" key={props.key}>
            <div className="h-full w-4/6 ">
                <div className=" w-full flex flex-col p-3">
                    <Link to={props.item.path}><h1 className="font-bold text-gray-400 text-xs">{props.item.title}</h1>
                        <h1 className="font-bold text-primary-500 text-xl">{item.loading ? "Loading" : props.item.value}
                            <span className="font-semibold pl-10 text-xl text-red-600 text-gray-400">
                                {props.item.percent && props.item.percent}{props.item.percent ? "%" : null}
                            </span>
                        </h1>
                    </Link>
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