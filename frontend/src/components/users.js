import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Layout from '../views/Layouts'
import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { FetchUsers } from './../redux/actions/auth.actions'
import Search_filter_component from './common/Search_filter_component'
import { DownloadFile } from './common/helperFunctions'
function Users(props) {
  const [filterText, setFilterText] = React.useState('');
  const [searchValue, setSearchValue] = useState("")
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);
  const serverSideColumns = [
    {
      sortable: true,
      name: 'Full Name',
      minWidth: '225px',
      selector: row => (<>{`${row.f_name} ${row.verification_code}`}</>)
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
  const subHeaderComponentMemo = React.useMemo(() => {

    return (
      <>
        <Search_filter_component
          onChangeFilter={onChangeFilter}
        
          searchValue={searchValue}
          
          download={() => DownloadFile(() =>
            props.FetchUsers({ limit: -1, download: true,  cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_users`
          )}
        />
        {/* <AddButton toggleCanvarse={toggleCanvarse} />
        <FilterContainer array={[{ value: 'status', label: 'Status' }]} changeSelect={changeSelect} 
        /> */}
        
      </>
    );
  }, [ searchValue,]);

  useEffect(() => {
    props.FetchUsers()
  }, [])
  console.log(props.users)
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

