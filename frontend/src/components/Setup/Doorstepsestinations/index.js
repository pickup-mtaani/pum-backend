import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'

import { get_destinations } from '../../../redux/actions/destinations.actions'

import Search_filter_component from '../../common/Search_filter_component'
import { DownloadFile } from '../../common/helperFunctions'
import { Link } from 'react-router-dom'
import Edit from './edit.modal'
import Layout from '../../../views/Layouts'
// const socket = io("https://stagingapi.pickupmtaani.com");
function Doorstepsestinations(props) {

  let initialState = {
    name: '', email: "", phone_number: '', password: '', id: ""
  }

  let agentObj = {
    business_name: '', opening_hours: "", closing_hours: '', prefix: '', isOpen: "",
    isSuperAgent: '', images: "", closing_hours: '', working_hours: '', location_id: "",
    rider: '', zone: "", mpesa_number: '', loc: '', location_id: "", agent_description: ''
  }
  const [rider, setRider] = useState('')
  const [agent, setAgent] = useState('')
  const [agentobj, setAgentObj] = useState(agentObj)
  const [datar, setData] = useState('')
  const [edit, setEdit] = useState(false)
  const [employees, setEmployees] = useState([])
  const [item, setItem] = useState(initialState);
  const assigRider = () => {

  }


  const columns = [
    {
      sortable: true,
      name: 'Name',
      minWidth: '10px',

      selector: row =>
      (<>
        <Link
          to={{
            pathname: `/agent/${row?.user?.name.replace(/\s/g, '')}`
          }}
          state={{
            agent: row?.user?.name,
            id: row?.user?._id,
          }}
        >{row.name}
        </Link>
      </>)

    },
    {
      sortable: true,
      name: 'Price',
      minWidth: '10px',
      selector: row => row.price
    },
    {
      sortable: true,
      name: 'location',
      minWidth: '30px',
      wrap: true,
      selector: row => row.road?.name
    },
    {
      sortable: true,
      name: 'Action',
      minWidth: '400px',
      selector: row => (
        <div className='flex gap-x-2'>
        </div>
      )
    },
  ]
  const changeInput = (e) => {
    const { name, value } = e.target !== undefined ? e.target : e;
    setItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const submit = async () => {

    await props.add_employee(agent, item)
    await fetch()
    setItem(initialState)

  }
  const [searchValue, setSearchValue] = useState("")

  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);

  const [show, setShow] = useState(false);

  const [Mpesadata, setMData] = useState([]);

  const onChangeFilter = (e) => {

  }
  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <>
        <Search_filter_component
          onChangeFilter={onChangeFilter}

          searchValue={searchValue}

          download={() => DownloadFile(() =>
            props.FetchAdmins({ limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_users`
          )}
        />
        <div className='px-2 bg-primary-500 my-1 rounded-md py-1 mx-2' onClick={() => setShow(true)}>Add New Door step Pricing </div>
      </>
    );
  }, [searchValue]);

  const fetch = async () => {
    await props.get_destinations()

  }
  useEffect(() => {

    fetch()

  }, [])

  console.log(props.destinations)
  return (

    <div className=" mx-2">
      <DataTable
        // title=" Agent to Agent Delivery"
        columns={columns}
        data={props.destinations}
        pagination
        paginationServer
        // progressPending={props.loading}
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        // onChangePage={handlePageChange}
        paginationTotalRows={totalRows}
      // onChangeRowsPerPage={handlePerRowsChange}
      />
      <Edit
        show={edit}
        changeInput={(e) => changeInput(e)}
        item={agentobj}
        riders={props.riders}
        locations={props.locations}
        submit={() => submit()}
        toggle={() => { setEdit(false); setItem(initialState) }}
      />
    </div>

  )
}


const mapStateToProps = (state) => {
  return {

    destinations: state.Destination.destinations,

    loading: state.Destination.loading,


  };
};

export default connect(mapStateToProps, { get_destinations })(Doorstepsestinations)

