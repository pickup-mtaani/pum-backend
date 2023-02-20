import React, { useEffect, useState } from 'react'
import Layout from '../../views/Layouts'
import { useLocation } from 'react-router-dom'

import { connect } from 'react-redux'

import {
    get_seller_bussiness
} from "../../redux/actions/bussiness.actions";
import {
    get_seller_products, get_all_products,
} from "../../redux/actions/products.actions";
import { getBissinessParcels } from '../../redux/actions/package.actions'
import Products from './products'
import Bussiness from './bussiness'
import Packages from './packages'

function UserDetails(props) {

    const [activeTab, setActiveTab] = useState(0);
    const [id, setId] = useState("");
    const [sellerid, setseller] = useState("");
    const [homeTab, setHometab] = useState(true);
    const [name, setName] = useState("");
    const location = useLocation()
    const fetchProducts = async (data) => {
        setId(data.id)
        setName(data.name)
        setActiveTab(1)
        await props.get_all_products(data.id)

    }
   
    const fetchPackages = async () => {
        setActiveTab(2);
        await props.getBissinessParcels(id);
    };
   
    let Tabs = [
        {
            name: "Business",
            component: (<Bussiness fetchProducts={fetchProducts} name={name} />),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 pr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>,
            Onchange: () => fetchProducts

        },
        {

            name: "Product",
            component: <Products name={name} fetchProducts={fetchProducts} />,
          
        },

        {

            name: "Packages",
            component: <Packages name={name} fetchProducts={fetchPackages} />,
            Onchange: () => fetchPackages()


        }
    ]
    const fetchBis = async (id) => {
        await props.get_seller_bussiness(id)
        // await props.get_seller_products(id)
    }
    useEffect(() => {
        const { id, name } = location.state
        
        setseller(id)
        setName(name)
        fetchBis(id)
    }, [])

    return (
        <Layout>
            <div className="tabs tabs-boxed ">

                {activeTab === 0 ? <div  className= "tab tab-active">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 pr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg> Business
                </div> : Tabs.map((tab, i) => (
                    <div key={i} className={`tab  ${i === activeTab ? "tab-active" : null} `} onClick={ () => tab.Onchange()}>
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

export default connect(mapStateToProps, { get_seller_bussiness, get_seller_products, get_all_products, getBissinessParcels })(UserDetails);
