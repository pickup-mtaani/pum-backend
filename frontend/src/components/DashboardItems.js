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


export function DashboardWHItem(props) {
    return (
        <div className="bg-white  w-1/2  ">
            <Link
                to={{
                    pathname: `/wahehouse/${props.obj.title.replace(/\s/g, '')}`,

                }}
                state={{
                    title: props.obj.title,
                    lis: props.obj.state
                }}
            > <div className="bg-white h-40  w-full  rounded-xl shadow-sm flex">
                    <div className="h-full w-4/6 ">
                        <div className=" w-full flex flex-col p-3">
                            <h1 className="font-bold text-gray-400 text-xl">{props.obj.title}</h1>
                        </div>
                    </div>
                    <div className="h-full w-2/6 flex justify-center items-center">
                        <div className="bg-gradient-to-l from-primary-600 to-primary-500  h-14 w-14 shadow-xl rounded-md flex justify-center items-center">
                            {props.obj.value}
                        </div>
                    </div>
                </div>
            </Link>
        </div >
    )
}
export function DashboardRider(props) {

    // senderAgentID
    // 63297ec72048eb2ffe1c3ec6
    // receieverAgentID
    // 632b25c533ec27c1c211fd97


    // senderAgentID
    // 632b25c533ec27c1c211fd97
    // receieverAgentID
    // 63297ec72048eb2ffe1c3ec6
    return (
        <div className="bg-white  w-80  " >
            <Link
                to={{
                    pathname: `/wahehouse/assign/${props?.rider?.user?.name.replace(/\s/g, '')}`,
                }}
                state={{

                    lis: props.path,
                    id: props?.rider?.user?._id,
                    rider: props.name,
                    agent: props.agent?._id,
                    title: props.title
                }}
            >  <div className="bg-white h-40  w-full  rounded-xl shadow-sm flex">
                    <div className="h-full w-full flex justify-center items-center">
                        <h1 className="font-bold text-gray-400 text-2xs pr-10">{props?.rider?.user?.name}</h1>
                        {/* <div className="bg-gradient-to-l from-primary-600 to-primary-500  h-10 w-10 shadow-xl rounded-full flex justify-center items-center">
                            {props?.obj?.value}
                        </div> */}
                    </div>
                </div>
            </Link>

        </div>
    )
}

export default DashboardItems