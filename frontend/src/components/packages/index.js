import React, { useEffect } from 'react'
import { useState } from 'react'
import Layout from '../../views/Layouts'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'

import Agent from './aent'

import DoorStep from './doorStep'
import Rent from './rent'

import { ShelfagentPackages, ShelfagentXPackages, ShelfstatePackages } from '../../redux/actions/agents.actions'

function Agents(props) {
  const [filterText, setFilterText] = React.useState('');
  const [searchValue, setSearchValue] = useState("")
  const location = useLocation()

  const [date, setDate] = useState("")
  const [tab, setTab] = useState("sent")
  const [data1, setData] = useState([])
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(5)
  const [limit, setLimit] = useState(5)
  const [totalRows, setTotalRows] = useState(0);
  const [state, setstate] = useState("all");




  return (
    <Layout>
      <div className='w-full p-2 flex flex-wrap border-b border-slate-400 gap-x-1'>
        <div className='md:w-1/6 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center' onClick={async () => { setTab('sent'); }} style={{ backgroundColor: tab === "sent" && "gray" }} >
          Agents Packages {tab === "sent" && data1.count}
        </div>

        <div className='md:w-1/6 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center' onClick={async () => { setTab('collected') }} style={{ backgroundColor: tab === "collected" && "gray" }} >
          Erand Packages {tab === "collected" && data1.count}
        </div>
        <div className='md:w-1/6 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center' onClick={async () => { setTab('shelf') }} style={{ backgroundColor: tab === "shelf" && "gray" }} >
          Door Packages {tab === "shelf" && data1.count}
        </div>
        <div className='md:w-1/6 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center' onClick={async () => { setTab('pending-agent') }} style={{ backgroundColor: tab === "pending-agent" && "gray" }} >
          Rent A Shelf Packages {tab === "sent" && data1.count}
        </div>
      </div>
      {tab === "sent" && <div className=" mx-2 my-10">
        <Agent />
      </div>}

      {tab === "shelf" && <div className=" mx-2 my-10">
        <DoorStep />
      </div>}
      {tab === "pending-agent" && <div className=" mx-2 my-10">
        <Rent />
      </div>}
      {tab === "collected" && <div className=" mx-2 my-10">
        <Rent />
      </div>}
    </Layout >
  )
}


const mapStateToProps = (state) => {
  return {

    loading: state.PackageDetails.loading,

    rent_shelf: state.PackageDetails.rented_shelf_packages

  };
};

export default connect(mapStateToProps, { ShelfagentPackages, ShelfagentXPackages, ShelfstatePackages })(Agents)

