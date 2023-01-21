import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'

import { get_payments } from '../../redux/actions/riders.actions'
import Search_filter_component from '../common/Search_filter_component'
import Layout from '../../views/Layouts'
import { columns } from './data'

function Users(props) {
  let initialState = {
    name: '', zone: "", rider: '',
  }
  const [filterText, setFilterText] = React.useState('');
  const [searchValue, setSearchValue] = useState("")
  const [routes, setData] = useState([])
  const [date, setDate] = useState("")
  const [tab, setTab] = useState("sent")
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState(initialState);
  const filteredItems = routes?.filter(
    item => item.collector_name.toLowerCase().includes(filterText.toLowerCase()),
  );
  const onChangeFilter = (e) => {
    setFilterText(e)
    const filtered = filteredItems.filter(
      item => item.collector_name && item.collector_name.toLowerCase().includes(filterText.toLowerCase()),
    );
    setFilterData(filtered)
  }


  const subHeaderComponentMemo = React.useMemo(() => {

    return (
      <>
        <Search_filter_component
          onChangeFilter={onChangeFilter}

          searchValue={searchValue}
          date={date}
          showModal={showModal}

        />

      </>
    );
  }, [searchValue, date, showModal]);
  const fetch = async (type) => {

    let routes = await props.get_payments()

    setData(routes)

  }
  useEffect(() => {
    fetch("agent")

  }, [])

  return (
    <Layout>

      <div className='w-full p-2 flex flex-wrap border-b border-slate-400 gap-x-1'>
        <div className='md:w-1/4 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center'
          onClick={async () => { await fetch("agent"); setTab('sent'); }} style={{ backgroundColor: tab === "sent" && "gray" }} >
          Agents Packages Collectors {tab === "sent"}
        </div>

        <div className='md:w-1/4 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center'
          onClick={async () => { await fetch("doorstep"); setTab('collected') }} style={{ backgroundColor: tab === "collected" && "gray" }} >
          Doorstep Packages collectors {tab === "collected"}
        </div>
        <div className='md:w-1/4 w-full flex flex-wrap p-2 shadow-md p-2 text-center bg-primary-500 justify-center items-center'
          onClick={async () => { await fetch("rent"); setTab('shelf') }} style={{ backgroundColor: tab === "shelf" && "gray" }} >
          Rent Shelf Packages Collection {tab === "shelf"}
        </div>

      </div>

      <div className=" mx-2">
        <DataTable
          // title=""
          columns={columns}
          data={routes}
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

    </Layout>
  )
}

Users.propTypes = {}


const mapStateToProps = (state) => {
  return {


  };
};

export default connect(mapStateToProps, { get_payments, })(Users)

