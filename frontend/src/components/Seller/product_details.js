import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import Layout from '../../views/Layouts'
import { get_single_product } from './../../redux/actions/products.actions'

export const Product_details = (props) => {

    const [product, seProduct] = useState({})
    const [active, setActive] = useState(0)
    const location = useLocation()
    const fetch = async (id) => {
        let result = await props.get_single_product(id)
        seProduct(result)
    }
    useEffect(() => {
        fetch(location.state.id)
        props.get_single_product(location.state.id)


    }, [])
    // console.log(product.images[0])
    return (
        <Layout>
            <div className="h-2/4  flex">
                <div className="w-1/3  h-full">
                    <div className="w-full h-5/6 p-2">
                        <img src={product.images !== undefined && product.images[active]} alt="" height="100px" className="h-full w-full object-cover" />
                    </div>
                    <div className="w-full h-1/6 flex  bg-blue-100">
                        {product.images !== undefined && product.images.map((imag, i) => (
                            <div className="gap-x-2 flex " onClick={() => setActive(i)} key={i} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                <div className=" mr-1" style={{ border: active !== i ? 'none' : '3px solid #ffc107', borderRadius: '10px' }}>
                                    <img src={imag} alt="" style={{ width: "50px", height: "50px", borderRadius: '10px', objectFit: 'cover' }} />
                                </div>
                            </div>
                            // <h1 style={{ color: props.active === i ? "red" : 'yellow' }}>{imag}</h1>
                        ))}
                    </div>
                </div>
                <div className="w-2/3  bg-blue-100 h-full flex   flex-col p-10">
                    <div className="gap-y-2 flex-col flex">
                        <h1 className="font-bold text-gray-500 text-2xl">{props.product.product_name}</h1>
                        <div className="flex gap-x-2  items-center">
                            choice of {product.colors !== undefined && product.colors.length}{product.colors !== undefined && product.colors.map((color, i) => (
                                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: color, borderColor: "black", borderWidth: "1px" }} ></div>
                            ))}
                        </div>
                        <div className="flex gap-x-2  items-center">
                            Sizes: {product.size !== undefined && product.size.length}{product.size !== undefined && product.colors.map((size, i) => (
                                <div className="flex justify-center items-center w-10 h-6 border border-blue-600 rounded-lg py-2">{size}</div>
                            ))}
                        </div>
                        <div>
                            Stock: {product && product.qty} {product.unit}
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