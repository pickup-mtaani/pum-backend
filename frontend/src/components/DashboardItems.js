import React from "react";
import { TbPackgeExport, TbPackgeImport } from "react-icons/tb";
import { Link } from "react-router-dom";

function DashboardItems(props) {
  // const { item } = props;

  return (
    <div
      className="bg-white h-20 w-56  rounded-xl shadow-sm flex"
      key={props.key}
    >
      <div className="h-full w-4/6 ">
        <div className=" w-full flex flex-col p-3">
          <Link to={props.item.path}>
            <h1 className="font-bold text-gray-400 text-xs">
              {props.item.title}
            </h1>
            <h1 className="font-bold text-primary-500 text-xl">
              {props.item.value}
              <span className="font-semibold pl-10 text-xl  text-gray-500">
                {props.item.percent && props.item.percent}
                {props.item.percent ? "%" : null}
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
  );
}

export function DashboardWHItem(props) {
  return (
    <div className="bg-white  w-1/2  ">
      <Link
        to={{
          pathname: `/wahehouse/${props.obj.title.replace(/\s/g, "")}`,
        }}
        state={{
          title: props.obj.title,
          lis: props.obj.state,
          type: props.obj.type,
        }}
      >
        {" "}
        <div className="bg-white h-40  w-full  rounded-xl shadow-sm flex">
          <div className="h-full w-4/6 ">
            <div className=" w-full flex flex-col p-3">
              <h1 className="font-bold text-gray-400 text-xl">
                {props.obj.title}
              </h1>
            </div>
          </div>
          {/* <div className="h-full w-2/6 flex justify-center items-center">
                        <div className="bg-gradient-to-l from-primary-600 to-primary-500  h-14 w-14 shadow-xl rounded-md flex justify-center items-center">
                            {props?.obj?.value}
                        </div>
                    </div> */}
        </div>
      </Link>
    </div>
  );
}
export function WHItem(props) {
  return (
    <div className=" w-full md:w-1/2 mb-4 lg:mb-8  md:md-0 bg-white rounded-xl shadow overflow-hidden">
      <Link
        to={{
          pathname: `${props?.obj.pathname}`,
        }}
        state={{
          title: props.obj.title,
          lis: props.obj.state,
          id: props.obj.id,
          data: props.obj.value,
          type: props.obj.type,
        }}
      >
        <div className="h-48 p-7 w-full ">
          <div className=" w-full flex  justify-between p-3">
            <h1 className="font-bold text-gray-800 text-lg uppercase">
              {props.obj.title}
            </h1>
            {/* {props.obj.count && (
                <div className="bg-red-200 w-10 h-10 flex text-center items-center justify-center rounded-full ">
                  10
                </div>
              )} */}
          </div>
          <div className="flex justify-between items-center w-full p-6">
            {/* icon */}
            {props?.type === "from" ? (
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#C7FFD5]">
                <TbPackgeImport className="text-3xl text-[#05BC38]" />
              </div>
            ) : props?.type === "unpicked" ? (
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#FFC7C7]">
                <TbPackgeImport className="text-3xl text-[#FF2930]" />
              </div>
            ) : (
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-[#FDF2CF]">
                <TbPackgeExport className="text-3xl text-[#F8C504]" />
              </div>
            )}
            {/* number of items */}
            <span className="font-bold text-2xl text-black">
              {props?.obj?.value || 0}{" "}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
export function DashboardRider(props) {
  return (
    <div className="bg-white  w-80  ">
      <Link
        to={{
          pathname: `/wahehouse/agent-agent/${
            props.title === "Assign to Riders" ? "Give-to-" : "Collectct-from-"
          }${props?.rider?.user?.name.replace(/\s/g, "")}/agents`,
        }}
        state={{
          lis: props.path,
          id: props?.rider?.user?._id,
          rider: props.name,
          agent: props.agent?._id,
          title: props.title,
          type: props.type,
        }}
      >
        {" "}
        <div className="bg-white h-40  w-full  rounded-xl shadow-sm flex">
          {/* <p>{props?.rider?.user?._id}</p> */}
          <div className="h-full w-full flex justify-center items-center">
            <h1 className="font-bold text-gray-400 text-2xs pr-10">
              {props?.rider?.user?.name}
            </h1>
            <br />

            {/* <div className="bg-gradient-to-l from-primary-600 to-primary-500  h-10 w-10 shadow-xl rounded-full flex justify-center items-center">
                            {props.count}
                        </div> */}
          </div>
        </div>
      </Link>
    </div>
  );
}
export function Dashboardagents(props) {
  return (
    <div className="bg-white  w-80 rounded-xl ">
      <Link
        to={{
          pathname: props?.path,
          // props.title === "Collect From Riders"
          //   ? `/warehouse/agent/pick-packages-from-rider/${props?.agent?.business_name.replace(
          //       /\s/g,
          //       ""
          //     )}`
          //   : `/wahehouse/agent-agent/assign-package-to/${props?.agent?.business_name.replace(
          //       /\s/g,
          //       ""
          //     )}`,
        }}
        state={{
          // lis: props.path,
          id: props?.agent?.user?._id,
          rider: props.rider,
          agent: props.agent?._id,
          title: props.title,
          type: props.type,
          data: props?.data,
        }}
      >
        {" "}
        <div className="bg-white h-40  w-full  rounded-xl shadow-sm flex ">
          <div className="h-full w-full flex justify-center items-center p-2">
            <h1 className="font-semibold text-black text-2xs pr-10">
              {props?.name}
            </h1>
            <div className="flex-shrink-0  h-10 w-10 border-2 border-gray-300  rounded-full flex justify-center items-center">
              {props.count || 0}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
export default DashboardItems;

// :
//     <Link

//         to={{
//             pathname: `/wahehouse/agent-agent/assign-package-to/${props.obj.title.replace(/\s/g, '')}`,

//         }}
//         // wahehouse/agent-agent/assign-package-to/:rider
//         state={{
//             title: props.obj.title,
//             lis: props.obj.state,
//             type: props.obj.type
//         }}
//     > <div className="bg-white h-40  w-full  rounded-xl shadow-sm flex">
//             <div className="h-full w-4/6 ">
//                 <div className=" w-full flex flex-col p-3">
//                     <h1 className="font-bold text-gray-400 text-xl">{props.obj.title}</h1>
//                 </div>
//             </div>
//             {/* <div className="h-full w-2/6 flex justify-center items-center">
//         <div className="bg-gradient-to-l from-primary-600 to-primary-500  h-14 w-14 shadow-xl rounded-md flex justify-center items-center">
//             {props?.obj?.value}
//         </div>
//     </div> */}
//         </div>
//     </Link>}
