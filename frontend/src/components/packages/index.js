import React, { } from 'react'
import Agent from './aent'
import { connect } from 'react-redux'
import Layout from '../../views/Layouts'
import DoorStep from './doorStep'
import Rent from './rent'
function index(props) {


  return (
    <Layout>
      <Agent />
      <DoorStep />
      <Rent />
    </Layout>
  )
}


const mapStateToProps = (state) => {
  return {

  };
};

export default connect(mapStateToProps, {})(index)

