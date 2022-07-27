import React, { useEffect, useState } from 'react'
import Layout from '../../views/Layouts'
import { useLocation } from 'react-router-dom'
import Logo from './../../img/top_logo.png'
import DashboardItems from '../DashboardItems'
import { connect } from 'react-redux'

import {
    get_seller_bussiness
} from "../../redux/actions/bussiness.actions";
import {
    get_seller_products
} from "../../redux/actions/products.actions";
import Products from './products'
import Bussiness from './bussiness'

function UserDetails(props) {
   
    const [activeTab, setActiveTab] = useState(0);
    const location = useLocation()

    let Tabs = [
        {
            name: "Business",
            component: (<Bussiness  />),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 pr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>

        },
        {

            // name: "Product", component: <div>Keendy</div>

        }
    ]

    const fetchBis = async (id) => {
        await props.get_seller_bussiness(id)
      }
    useEffect(() => {
        const { id } = location.state
        
        fetchBis(id)
        // props.get_seller_bussiness(id)

    }, [])
   
    return (
        <Layout>
            {/* <div className="w-full h-full mt-20">
                <div className="h-6 mx-2 bg-red-300 relative z-0 flex  border-4 border-white ">
                    <div className="w-3/4">

                    </div>
                    <div className="w-1/4 pt-20 flex flex-col">
                        <h1 className="font-bold uppercase text-primary-500">{Bussiness?.name}</h1>
                        <h2 className="italic "> {Bussiness?.category?.name}</h2>
                        <h2 className="italic "><span>Mpesa:</span> hgcg{Bussiness?.Mpesa_No}/<span>Till:</span> hn{Bussiness?.till_No}</h2>
                    </div>
                    <div className="absolute inset-0  z-10 -top-14 left-20 ">
                        <div className="w-40 h-40  rounded-full flex justify-center items-center">
                            <img src={Bussiness?.logo} alt="" className="w-36 h-36  rounded-full border-4 border-white flex justify-center items-center" />
                            <button className="btn">Hello daisyUI</button>
                        </div>

                    </div>
                    <div className=" absolute inset-0  z-10 mx-2 flex py-5 gap-x-2  justify-center items-center -bottom-60">
                        <DashboardItems item={{ title: "Products", value: SellerProducts.length }} />
                        <DashboardItems item={{ title: "", value: "" }} />
                        <DashboardItems item={{ title: "", value: "", percent: "" }} />
                        <DashboardItems item={{ title: "", value: '', percent: "" }} />
                    </div>
                </div>

            </div> */}
            <div className="tabs tabs-boxed ">

                {Tabs.map((tab, i) => (
                    <div key={i} className={`tab  ${i === activeTab ? "tab-active" : null} `} onClick={() => setActiveTab(i)}>
                        {tab.icon} {tab.name}
                    </div>
                ))}

            </div>
            <div className=" mx-2 flex mt-12 py-5">
                {Tabs[activeTab].component}
            </div>

        </Layout>
    )
}


const mapStateToProps = (state) => {
    return {
        error: state.userDetails.error,
        loading: state.userDetails.loading,
        bussinessES: state.bussiness.bussinsses
    }

};

export default connect(mapStateToProps, { get_seller_bussiness, get_seller_products })(UserDetails);
