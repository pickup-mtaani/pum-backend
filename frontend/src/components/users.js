import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Layout from '../views/Layouts'
import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { FetchUsers } from './../redux/actions/auth.actions'
function Users(props) {
  const serverSideColumns = [
    {
      sortable: true,
      name: 'Full Name',
      minWidth: '225px',
      selector: row => (<>{`${row.f_name} ${row.l_name}`}</>)
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
  // const subHeaderComponentMemo = React.useMemo(() => {

  //   return (
  //     <>
  //       <Search_filter_component
  //         onChangeFilter={onChangeFilter}
  //         status={status}
  //         searchValue={searchValue}
  //         download={() => DownloadFile(() =>
  //           props.getproducts({ limit: -1, download: true, status: status, cursor: props.lastElement, q: searchValue, enabled: true, }),
  //           `${totalRows > 0 ? totalRows : "all"}_${status}_products`
  //         )}
  //       />
  //       <AddButton toggleCanvarse={toggleCanvarse} />
  //       <FilterContainer array={[{ value: 'status', label: 'Status' }]} changeSelect={changeSelect} />
  //     </>
  //   );
  // }, [status, searchValue,]);

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
          data={props.users}
          pagination
          paginationServer
          progressPending={props.loading}
          // paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          // subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
        // onChangePage={handlePageChange}
        // paginationTotalRows={totalRows}
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

