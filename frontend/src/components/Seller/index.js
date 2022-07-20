import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { FetchUsers } from '../../redux/actions/auth.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
import { Sellers_columns } from './data'
import Modal from '../common/modal'
import Date_range from './modals/date_range.modal'
function Users(props) {
  const [filterText, setFilterText] = React.useState('');
  const [searchValue, setSearchValue] = useState("")
  
  const [date, setDate] = useState({
    start_date: '',
    end_date: ""
  })

  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);
  const [showModal, setShowModal] = useState(false);

  const filteredItems = props.users.filter(
    item => item.f_name && item.f_name.toLowerCase().includes(filterText.toLowerCase()),
  );
  const onChangeFilter = (e) => {
    setFilterText(e)
    const filtered = filteredItems.filter(
      item => item.title && item.title.toLowerCase().includes(filterText.toLowerCase()),
    );
    setFilterData(filtered)
  }
  const setTime = async (e) => {
    const { value, name } = e.target;
    if (value === "Today") {
      setDate({
        start_date: new Date(),
        end_date: new Date()
      })
      await filter_BY_date()
    }

  }
  const filter_BY_date = async () => {
    
    await props.FetchUsers({ date: date })

  }
  const subHeaderComponentMemo = React.useMemo(() => {

    return (
      <>
        <Search_filter_component
          onChangeFilter={onChangeFilter}

          searchValue={searchValue}
          date={date}
          setTime={setTime}
          download={() => DownloadFile(() =>
            props.FetchUsers({ date, limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_users`
          )}
        />
        <select className="border py-1 px-2 border-slate-200 mx-2 rounded-md " onChange={(e) => setTime(e)}>
          <option >Filters</option>
          <option value="Today">Today</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
        {/* <input type="date" onChange={e => filter_BY_date(e.target.value)} placeholder="Select a date" style={{ marginRight: 20, borderColor: "red" }} /> */}
        {/* <AddButton toggleCanvarse={toggleCanvarse} />
        <FilterContainer array={[{ value: 'status', label: 'Status' }]} changeSelect={changeSelect} 
        /> */}

      </>
    );
  }, [searchValue, date,setTime]);

  useEffect(() => {
    props.FetchUsers({ date })
  }, [])
  return (
    <Layout>
      <div className=" mx-2">
        <DataTable
          // title=""
          columns={Sellers_columns}
          data={filteredItems}
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
      <Date_range toggle={() => setShowModal(false)} show={showModal} />

    </Layout>
  )
}

Users.propTypes = {}


const mapStateToProps = (state) => {
  return {
    users: state.userDetails.users,
    // lastId: state.userDetails.lastId,
    loading: state.userDetails.loading,
    // error: state.userDetails.error,
  };
};

export default connect(mapStateToProps, { FetchUsers })(Users)

