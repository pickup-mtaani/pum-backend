import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_agents, get_zones, get_agents_employees, assign, add_employee, fetchpackages } from '../../redux/actions/agents.actions'
import { get_riders, } from '../../redux/actions/riders.actions'
import { get_routes } from '../../redux/actions/routes.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
import moment from 'moment'
import Add_admin from './add.modal'
import { Link } from 'react-router-dom'
import Manage from './manage.modal'
import Edit from './edit.modal'
// const socket = io("https://stagingapi.pickupmtaani.com");
function Agents(props) {

  let initialState = {
    name: '', email: "", phone_number: '', password: '', id: ""
  }

  let agentObj = {
    business_name: '', opening_hours: "", closing_hours: '', prefix: '', isOpen: "",
    isSuperAgent: '', images: "", closing_hours: '', working_hours: '', location_id: "",
    rider: '', zone: "", mpesa_number: '', loc: '', location_id: ""
  }
  const [rider, setRider] = useState('')
  const [agent, setAgent] = useState('')
  const [datar, setData] = useState('')
  const [edit, setEdit] = useState(false)
  const [employees, setEmployees] = useState([])
  const [item, setItem] = useState(initialState);
  const assigRider = () => {

  }

  const toggleManage = async (row) => {
    let result = await props.get_agents_employees(row._id)
    setEmployees(result)
    setShow(true); setData(row)

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
        >{row.business_name}
        </Link>
      </>)

    },
    {
      sortable: true,
      name: 'Phone number',
      minWidth: '10px',
      selector: row => row.user?.phone_number
    },
    {
      sortable: true,
      name: 'location',
      minWidth: '30px',
      wrap: true,
      selector: row => row.location_id?.name
    },
    {
      sortable: true,
      name: 'Action',
      minWidth: '400px',
      selector: row => (
        <div className='flex gap-x-2'>
          <div className='p-2 bg-red-100' onClick={() => { setShowModal(true); setAgent(row._id) }}>Add Employee</div>
          <div className="" >
            <select onChange={(event) => props.assign(event?.target?.value, row._id)} className="">
              <option value=""> Select Rider</option>
              {props.riders?.map((rider, i) => (
                <option key={i} value={rider.user?._id} >{rider?.user?.name}</option>
              ))}

            </select>

          </div>
          <div className='p-2 bg-red-100' onClick={() => {
            setEdit(true); setAgent(row._id); setItem({
              name: row?.user?.name, email: row?.user?.email, phone_number: row?.user?.phone_number, password: row?.user?.name, id: 'id'
            })
          }}>Edit</div>
          <div className='p-2 bg-red-100' onClick={() => toggleManage(row)}>Manage</div>

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
    setShowModal(false)
  }
  const [searchValue, setSearchValue] = useState("")

  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);
  const [showModal, setShowModal] = useState(false);
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

          showModal={showModal}
          download={() => DownloadFile(() =>
            props.FetchAdmins({ limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_users`
          )}
        />


      </>
    );
  }, [searchValue, showModal]);

  const fetch = async () => {
    await props.get_agents()
    await props.get_riders()
  }
  useEffect(() => {

    fetch()

  }, [])


  return (
    <Layout>
      <div className=" mx-2">
        <DataTable
          // title=" Agent to Agent Delivery"
          columns={columns}
          data={props.agents}
          pagination
          paginationServer
          progressPending={props.loading}
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
          // onChangePage={handlePageChange}
          paginationTotalRows={totalRows}
        // onChangeRowsPerPage={handlePerRowsChange}
        />
      </div>

      <Add_admin
        show={showModal}
        changeInput={(e) => changeInput(e)}
        item={item}
        submit={() => submit()}
        toggle={() => { setShowModal(false); setItem(initialState) }}
      />
      <Edit
        show={edit}
        changeInput={(e) => changeInput(e)}
        item={item}
        submit={() => submit()}
        toggle={() => { setEdit(false); setItem(initialState) }}
      />
      <Manage
        show={show}
        changeInput={(e) => changeInput(e)}
        data={datar}
        employees={employees}
        submit={() => submit()}
        toggle={() => setShow(false)}
      />
    </Layout>
  )
}


const mapStateToProps = (state) => {
  return {

    agents: state.agentsData.agents,
    riders: state.ridersDetails.riders,
    loading: state.agentsData.loading,
    // error: state.userDetails.error,
  };
};

export default connect(mapStateToProps, { get_agents, get_agents_employees, get_riders, add_employee, get_routes, get_zones, assign, fetchpackages })(Agents)

