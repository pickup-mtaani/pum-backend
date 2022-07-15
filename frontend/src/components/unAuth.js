import React from 'react'
import Unauth from './../img/unauth.png'
import { Logout } from './common/helperFunctions'
import { useNavigate } from "react-router-dom";
function UnAuth() {
    const navigate = useNavigate();
    const Logout = async () => {
        await localStorage.clear();
        return navigate("/");
    }
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-primary-500 to-primary-600 ">
            <div>
                <img src={Unauth} alt="" />
                <div className="flex justify-center items-center border px-2 py-1 " onClick={() => Logout()}>
                    <h2 className="text-center">Logout</h2>
                </div>
            </div>
        </div>
    )
}

export default UnAuth