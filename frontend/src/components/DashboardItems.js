import React from 'react'
import { Link } from 'react-router-dom'

function DashboardItems(props) {
    const { item } = props

    return (
        <div className="bg-white h-20 w-56  rounded-xl shadow-sm flex" key={props.key}>
            <div className="h-full w-4/6 ">
                <div className=" w-full flex flex-col p-3">
                    <Link to={props.item.path}><h1 className="font-bold text-gray-400 text-xs">{props.item.title}</h1>
                        <h1 className="font-bold text-primary-500 text-xl">{props.item.value}
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
                    lis: props.obj.state,
                    type: props.obj.type
                }}
            > <div className="bg-white h-40  w-full  rounded-xl shadow-sm flex">
                    <div className="h-full w-4/6 ">
                        <div className=" w-full flex flex-col p-3">
                            <h1 className="font-bold text-gray-400 text-xl">{props.obj.title}</h1>
                        </div>
                    </div>
                    {/* <div className="h-full w-2/6 flex justify-center items-center">
                        <div className="bg-gradient-to-l from-primary-600 to-primary-500  h-14 w-14 shadow-xl rounded-md flex justify-center items-center">
                            {props?.obj?.value}
                        </div>
                    </div> */}
                </div>
            </Link>
        </div >
    )
}
export function WHItem(props) {
    return (
        <div className="bg-white  w-1/2  ">
            <Link
                to={{
                    pathname: `${props.obj.pathname}`,
                }}
                state={{
                    title: props.obj.title,
                    lis: props.obj.state,
                    id: props.obj.id,
                    data: props.obj.value,
                    type: props.obj.type
                }}
            > <div className="bg-white h-48 p-10  w-full  rounded-xl shadow-sm flex">
                    <div className="h-full w-4/6 ">
                        <div className=" w-full flex  justify-between p-3">
                            <h1 className="font-bold text-gray-400 text-xl text-red-200 uppercase">{props.obj.title}</h1>
                            {props.obj.count && <div className='bg-red-200 w-10 h-10 flex text-center items-center justify-center rounded-full '>10</div>}

                        </div>
                    </div>
                    <div className="h-full w-2/6 flex justify-center items-center">
                        {/* <div className='flex flex-col gap-y-4'> */}
                        {/* <div>pckages on Transit:{props.obj.value.transit}</div> */}
                        {/* <div> To be recieved   :{props.obj.value.dropped}</div>
                            <div> To be assigned to  rider :{props.obj.value.recieved}</div>
                        </div> */}

                        {/* <div className="bg-gradient-to-l from-primary-600 to-primary-500  h-14 w-14 shadow-xl rounded-md flex justify-center items-center">
                            {props.obj.value}
                        </div> */}
                    </div>
                </div>
            </Link>
        </div >
    )
}
export function DashboardRider(props) {

    //    // /wahehouse/agent-agent/pick-package-from/${props?.rider?.user?.name.replace(/\s/g, '')}`,
    return (
        <div className="bg-white  w-80  " >
            <Link
                to={{
                    pathname: `/wahehouse/agent-agent/${props?.rider?.user?.name.replace(/\s/g, '')}/agents`

                }}
                state={{

                    lis: props.path,
                    id: props?.rider?.user?._id,
                    rider: props.name,
                    agent: props.agent?._id,
                    title: props.title,
                    type: props.type
                }}
            >  <div className="bg-white h-40  w-full  rounded-xl shadow-sm flex">
                    <div className="h-full w-full flex justify-center items-center">
                        <h1 className="font-bold text-gray-400 text-2xs pr-10">{props?.rider?.user?.name}</h1>
                        {/* <div className="bg-gradient-to-l from-primary-600 to-primary-500  h-10 w-10 shadow-xl rounded-full flex justify-center items-center">
                            {props?.rider.no_of_packages}
                        </div> */}
                    </div>
                </div>
            </Link>

        </div>
    )
}
export function Dashboardagents(props) {

    return (
        <div className="bg-white  w-80  " >
            <Link
                to={{
                    pathname: props.title === "Collect From Riders" ? `/wahehouse/agent-agent/pick-package-from-rider/${props?.agent?.agent?.business_name.replace(/\s/g, '')}` :
                        `/wahehouse/agent-agent/assign-package-to/${props?.agent?.agent?.business_name.replace(/\s/g, '')}`


                }}
                state={{

                    lis: props.path,
                    id: props?.agent?.user?._id,
                    rider: props.rider,
                    agent: props.agent?.agent?._id,
                    title: props.title,
                    type: props.type
                }}
            >  <div className="bg-white h-40  w-full  rounded-xl shadow-sm flex">
                    <div className="h-full w-full flex justify-center items-center">
                        <h1 className="font-bold text-gray-400 text-2xs pr-10">{props?.name}</h1>
                        {/* <div className="bg-gradient-to-l from-primary-600 to-primary-500  h-10 w-10 shadow-xl rounded-full flex justify-center items-center">
                            {props?.rider.no_of_packages}
                        </div> */}
                    </div>
                </div>
            </Link>

        </div>
    )
}
export default DashboardItems