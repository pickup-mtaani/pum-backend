import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import Layout from '../../views/Layouts'
import { get_single_product } from './../../redux/actions/products.actions'

export const Product_details = (props) => {
    const { product } = props
    const location = useLocation()
    useEffect(() => {
        props.get_single_product(location.state.id)

    }, [])
    return (
        <Layout>
            <div className="h-4/5  flex">
                <div className="w-1/3  h-full p-2">
                    <div className="w-full h-3/4 ">
                        <img src={product.images[0]} alt="" />
                    </div>
                    <div className="w-full h-1/4 bg-yellow-400 mt-1"></div>
                </div>
                <div className="w-2/3  bg-blue-100 h-full flex   flex-col p-10">
                    <div className="gap-y-2 flex-col flex">
                        <h1 className="font-bold text-gray-500 text-2xl">{props.product.product_name}</h1>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "red", borderColor: "black", borderWidth: "1px" }} ></div>
                        <div>
                            <div className="flex justify-center items-center w-10 h-6 border border-blue-600 rounded-lg py-2">25</div>
                        </div>
                    </div>


                </div>
            </div>
        </Layout>
    )
}

const mapStateToProps = (state) => ({
    product: state.products.product,
    loading: state.products.loading,
})

const mapDispatchToProps = { get_single_product }

export default connect(mapStateToProps, mapDispatchToProps)(Product_details)