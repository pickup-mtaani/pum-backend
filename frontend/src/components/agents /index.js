import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_agents, delete_agents, make_super, get_zones, get_agents_employees, activate_user, activate_agents, assign, add_employee, fetchpackages } from '../../redux/actions/agents.actions'
import { get_riders, } from '../../redux/actions/riders.actions'
import { getagentlocations, } from '../../redux/actions/location.actions'
import { get_routes } from '../../redux/actions/routes.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
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
          {/* <div className='px-2 bg-slate-300 my-1 rounded-md py-2' onClick={() => {
            setEdit(true); setAgent(row._id); setAgentObj({
              business_name: row.business_name, opening_hours: row.opening_hours, closing_hours: row.closing_hours, prefix: row.prefix, isOpen: row.isOpen,
              isSuperAgent: row.isSuperAgent, images: [], working_hours: row.working_hours, location_id: row.location_id._id, locationName: row.location_id?.name,
              rider: row.rider, zone: row.zone, mpesa_number: row.mpesa_number, agent_description: row.agent_description, ridername: row.rider?.user?.name
            })
          }}>Edit Agent</div> */}
          {/* <div className='px-2 bg-slate-300 my-1 rounded-md py-2' onClick={() => { props.activate_agents(row._id); fetch() }}>Activate contact person</div> */}
          <div className='px-2 bg-slate-300 my-1 rounded-md py-2' onClick={() => { toggleManage(row); setAgent(row._id); fetch(); console.log(JSON.stringify(row)) }}>Manage Attendants</div>
          <div onClick={async () => { await props.delete_agents(row._id); await fetch() }}>Delete Agent</div>
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


      </>
    );
  }, [searchValue]);

  const fetch = async () => {
    await props.get_agents()
    await props.get_riders()
    await props.getagentlocations()
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


      <Edit
        show={edit}
        changeInput={(e) => changeInput(e)}
        item={agentobj}
        riders={props.riders}
        locations={props.locations}
        submit={() => submit()}
        toggle={() => { setEdit(false); setItem(initialState) }}
      />
      <Manage
        show={show}
        changeInput={(e) => changeInput(e)}
        add_employee={props.add_employee}
        data={datar}
        make_super={props.make_super}
        activate={props.activate_user}
        assign={props.assign}
        agent={agent}
        activate_agents={props.activate_agents}
        toggleManage={toggleManage}
        get_agents_employees={get_agents_employees}
        riders={props.riders}
        locations={props.riders}
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
    locations: state.LocationDetail.locations

  };
};

export default connect(mapStateToProps, { get_agents, make_super, delete_agents, get_agents_employees, getagentlocations, activate_user, activate_agents, get_riders, add_employee, get_routes, get_zones, assign, fetchpackages })(Agents)

