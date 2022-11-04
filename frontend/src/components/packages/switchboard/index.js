import React, { useEffect, useState } from 'react'
import Agent from './agent.switchboard'
import Rent from './rent.switchboard'
import { connect } from 'react-redux'
import { get_rent_shelf_tracks } from './../../../redux/actions/switchboard.actions'
import Layout from '../../../views/Layouts'
function Index(props) {
    const [view, setView] = useState('agent')
    useEffect(() => {
        props.get_rent_shelf_tracks()
    }, [])

    return (
        <Layout>
            <div style={{ display: 'flex', width: '100%', alignSelf: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10, border: 'gray 1px solid', width: '30%' }} onClick={() => setView("agent")}>Agent</div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10, border: 'gray 1px solid', width: '30%' }} onClick={() => setView("rent")}>Rent  a Shelf</div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10, border: 'gray 1px solid', width: '30%' }} onClick={() => setView("door")}>Door Step</div>
            </div>
            <h3 style={{ textAlign: 'center', textTransform: 'uppercase', textDecoration: 'underline' }}>{view}'s SwitchBoard</h3>
            {view === "agent" ? <Agent /> : view === "rent" ? <Rent data={props.rentTracks} /> : null}
            {/* {view === "rent" && <Rent />} */}
        </Layout>
    )
}


const mapStateToProps = (state) => {
    return {
        riders: state.ridersDetails.riders,
        packages: state.PackageDetails.packages,
        rentTracks: state.switchboard.shelf_packages_tracks,
        loading: state.PackageDetails.indexloading,

    };
};

export default connect(mapStateToProps, { get_rent_shelf_tracks })(Index)

