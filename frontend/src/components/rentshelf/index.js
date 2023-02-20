import React, { useEffect, useState } from 'react'
import Layout from '../../views/Layouts'
import { WHItem } from '../DashboardItems'
import { shelfLocations } from '../../redux/actions/agents.actions'
import { connect } from 'react-redux'


function Index(props) {
    const [data, setData] = useState([])
    const fetch = async () => {
        let result = await props.shelfLocations()
        console.log(result)
        setData(result)
    }
    useEffect(() => {
        fetch()
    }, [])
    return (
        <Layout>
            <div className='flex w-full gap-x-20 '>
                {data.map((item, index) => (
                    < WHItem noCount={false} obj={{ title: `${item.business_name}`, pathname: `/rent-a-shelf/${item.business_name.replace(/\s/g, '')}/businesses`, id: item._id }} />
                ))}

            </div>
        </Layout>
    )
}


const mapStateToProps = (state) => {
    return {

    };
};

export default connect(mapStateToProps, { shelfLocations })(Index)


