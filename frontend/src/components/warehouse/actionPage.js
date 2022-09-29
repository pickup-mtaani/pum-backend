import React, { useEffect } from 'react'

import { connect } from 'react-redux'
import { get_riders, fetchpackages } from '../../redux/actions/riders.actions'
import Layout from '../../views/Layouts'
import { DashboardRider } from '../DashboardItems'


function ActionPage(props) {


    useEffect(() => {
        props.get_riders({ limit: 10 })

    }, [])

    return (
        <Layout>
            <h2 className='text-center p-10 text-xl '> </h2>
            <div className='flex  w-full'>
                <div className='flex flex-wrap gap-1  w-full'>
                    {props.riders.map((rider, i) => (
                        <DashboardRider i={i} rider={rider} />
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

