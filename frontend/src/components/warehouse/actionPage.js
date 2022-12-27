import React, { useEffect } from 'react'

import { connect } from 'react-redux'
import { get_riders, fetchpackages } from '../../redux/actions/riders.actions'
import { useLocation } from 'react-router-dom'
import Layout from '../../views/Layouts'
import { DashboardRider } from '../DashboardItems'

function ActionPage(props) {
    const location = useLocation()
    useEffect(() => {
        props.get_riders({ limit: 1000 })
    }, [])

    return (
        <Layout>
            <div className='flex justify-center items-center py-10'>
                <h2 className='text-uppercase text-3xl underline'>{location?.state?.title}</h2>
            </div>
            <div className='flex  w-full'>
                <div className='flex flex-wrap gap-1  w-full'>
                    {props?.riders?.map((rider, i) => (
                        <DashboardRider key={i} rider={rider} id={rider?.user?._id} title={location?.state?.title} path={location?.state?.lis} name={rider?.user?.name} />
                    ))}
                </div>
            </div>
        </Layout>
    )
}

ActionPage.propTypes = {}


const mapStateToProps = (state) => {
    return {

        riders: state.ridersDetails.riders,
        loading: state.ridersDetails.loading,

    };
};

export default connect(mapStateToProps, { get_riders, fetchpackages })(ActionPage)

