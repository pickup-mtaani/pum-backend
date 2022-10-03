import React, { useEffect } from 'react'

import { connect } from 'react-redux'
import { get_riders, fetchpackages } from '../../redux/actions/riders.actions'
import { useLocation } from 'react-router-dom'
import Layout from '../../views/Layouts'
import { DashboardRider } from '../DashboardItems'


// 7C:76:35:D6:D7:5B		Local
// 4C:D3:AF:23:F3:F5		
// 58:10:B7:6B:06:1A

function ActionPage(props) {
    const location = useLocation()

    useEffect(() => {
        props.get_riders({ limit: 10 })

    }, [])

    return (
        <Layout>
            <div className='flex justify-center items-center py-10'>
                <h2 className='text-uppercase text-3xl underline'>{location?.state?.title}</h2>
            </div>

            <h2 className='text-center p-10 text-xl '> </h2>
            <div className='flex  w-full'>
                <div className='flex flex-wrap gap-1  w-full'>
                    {props.riders.map((rider, i) => (
                        <DashboardRider key={i} rider={rider} title={location?.state?.title} path={location?.state?.lis} agent={rider?.agent} name={rider?.user?.name} />
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

