import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { FetchUsers } from '../../redux/actions/auth.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import { Link } from 'react-router-dom'
import Layout from '../../views/Layouts'
function Users(props) {
  const [filterText, setFilterText] = React.useState('');
  const [searchValue, setSearchValue] = useState("")
  const [date, setDate] = useState("")
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);
  const serverSideColumns = [
    {
      sortable: true,
      name: 'Full Name',
      minWidth: '225px',
      selector: row => (
        <Link to={`/seller/${row.f_name}`}
          state={{ id: row._id }}
        >
          {`${row.f_name} ${row.l_name}`}</Link>
      )
    },
    {
      sortable: true,
      name: 'Email',
      minWidth: '250px',
      selector: row => row.email
    },
    {
      sortable: true,
      name: 'Role',
      minWidth: '250px',
      selector: row => row.role && row.role.name
    },
    {
      sortable: true,
      name: 'Phone Number',
      minWidth: '150px',
      selector: row => row.phone_number
    }
  ]
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

  const filter_BY_date = async (e) => {

    await props.FetchUsers({ date: new Date(e) })

  }
  const subHeaderComponentMemo = React.useMemo(() => {

    return (
      <>
        <Search_filter_component
          onChangeFilter={onChangeFilter}

          searchValue={searchValue}
          date={date}
          download={() => DownloadFile(() =>
            props.FetchUsers({ date, limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_users`
          )}
        />
        <input type="date" onChange={e => filter_BY_date(e.target.value)} placeholder="Select a date" style={{ marginRight: 20, borderColor: "red" }} />
        {/* <AddButton toggleCanvarse={toggleCanvarse} />
        <FilterContainer array={[{ value: 'status', label: 'Status' }]} changeSelect={changeSelect} 
        /> */}

      </>
    );
  }, [searchValue, date]);

  useEffect(() => {
    props.FetchUsers({ date: date })
  }, [])

  return (
    <Layout>
      <div className=" mx-2">
        <DataTable
          //title="PortFolio Reports"
          columns={serverSideColumns}
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

