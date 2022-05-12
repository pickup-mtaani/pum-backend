import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import AddThrift from "../components/AddThriftModal";


export function Layout(props) {

  
    // const [user, setUser] = useState()
    const user = JSON.parse(localStorage.getItem("userInfo"));
    
  
  
    return (
        <div className="w-full h-screen bg-gray-200 flex justify-center items-center">
            <div className="bg-gray-400  w-full h-full m-2 relative z-0">
                <div className="absolute inset-0 flex justify-center rounded-lg items-center z-10 bg-white m-10">
                    <div className="w-full h-full flex flex-col">
                        <div className="h-10 bg-slate-500">
                            <div className="flex justify-between mx-10">
                                  <div className="flex justify-center items-center pt-2">
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <h2 className="text-xl capitalize">{user !== undefined ? user.username : "Seed User"}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="h-5/6 ">
                            <div className="flex w-full">
                                {props.children}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        // locations: state.LocationDetail.locations,
    };
};


export default connect(mapStateToProps, {  })(Layout);
