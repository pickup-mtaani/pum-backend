import React from 'react'
import Logo from './../img/top_logo.png'
import { Link } from 'react-router-dom'
const menuItems = [
    {
        title: 'Home', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>,
        path: '/'
    },
    {
        title: 'Users', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>,
        path: '/users'
    }
]

function Layout(props) {
    return (
        <div className="w-screen h-screen flex bg-slate-100">
            <div className="w-1/5 h-screen flex flex-col bg-slate-100">
                <div className="w-full  bg-slate-100 my-5 p-10 h-10 flex justify-center items-center  shadow-sm">
                    <img src={Logo} alt="" height={10} width={150} />
                </div>
                <div className="w-full flex flex-col">
                    {menuItems.map((item, i) => (
                        <Link to={item.path} className=" mx-5 my-2 h-10 flex hover:text-primary-500 hover:bg-white rounded-md" key={i}>
                            <div className="bg-white flex justify-center items-center h-10 w-10 shadow-sm rounded-md mb-100">{item.icon}</div>
                            <div className="h-10 flex justify-center items-center"><h2 className="text-gray-700 px-2 hover:text-primary-500">{item.title}</h2></div>
                        </Link>
                    ))}
                </div>

            </div>

            <div className="w-4/5  flex  ">
                <div className="w-full flex flex-col">
                    <div className="w-full h-14  flex">
                        <div className="w-3/4 "></div>
                        <div className="w-1/3  flex justify-center items-center">
                            <input type="text" className="rounded-md h-8 bg-transparent  w-full mr-5 border border-slate-300 pl-2 justify-center items-center" placeholder="Search" />
                        </div>
                        <div className="w-56 my-auto  flex">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 justify-center items-center" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <h2>Login</h2>
                        </div>
                    </div>
                    <div className="w-full flex flex-col mt-10 ">
                      {props.children}
                    </div>

                </div>
            </div>



        </div>
    )
}

export default Layout