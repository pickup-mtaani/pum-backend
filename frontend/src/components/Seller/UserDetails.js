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

function UserDetails(props) {
    const [Bussiness, setBussiness] = useState({})
    const [SellerProducts, setProducts] = useState({})
    const location = useLocation()

    const fetchData = async (id) => {
        let products_array = await props.get_seller_products(id)
        let result = await props.get_seller_bussiness(id)
        setBussiness(result)
        setProducts(products_array)
    }
    useEffect(() => {
        const { id } = location.state
        fetchData(id)

    }, [])
    return (
        <Layout>
            <div className="w-full h-full mt-20">
                <div className="h-56 mx-2 bg-red-300 relative z-0 flex  border-4 border-white ">
                    <div className="w-3/4">

                    </div>
                    <div className="w-1/4 pt-20 flex flex-col">
                        <h1 className="font-bold uppercase text-primary-500">{Bussiness?.name}</h1>
                        <h2 className="italic text-white"> {Bussiness?.category?.name}</h2>
                        <h2 className="italic text-white"><span>Mpesa:</span> {Bussiness?.Mpesa_No}/<span>Till:</span> {Bussiness?.till_No}</h2>
                    </div>
                    <div className="absolute inset-0  z-10 -top-14 left-20 ">
                        <div className="w-40 h-40  rounded-full flex justify-center items-center">
                            <img src={Bussiness?.logo} alt="" className="w-36 h-36  rounded-full border-4 border-white flex justify-center items-center" />
                        </div>

                    </div>
                    <div className=" absolute inset-0  z-10 mx-2 flex py-5 gap-x-2  justify-center items-center -bottom-60">
                        <DashboardItems item={{ title: "Products", value: SellerProducts.length }} />
                        <DashboardItems item={{ title: "Riders", value: 4 }} />
                        <DashboardItems item={{ title: "Total Sales", value: "1200", percent: 6 }} />
                        <DashboardItems item={{ title: "sales this week", value: '20', percent: 1 }} />
                    </div>
                </div>

            </div>
            <div className=" mx-2 flex mt-12 py-5">
                <Products data={SellerProducts} />
            </div>
          
        </Layout>
    )
}


const mapStateToProps = (state) => {
    return {
        error: state.userDetails.error,
        loading: state.userDetails.loading,
        // packages: state.PackageDetails.packages
    }

};

export default connect(mapStateToProps, { get_seller_bussiness, get_seller_products })(UserDetails);
