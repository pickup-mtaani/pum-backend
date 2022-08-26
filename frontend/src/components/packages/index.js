import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { getParcels } from '../../redux/actions/package.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
import { door_step_columns, rent_shelf_columns } from './data'
import PackageDetail from './packageDetails.modal'

function Users(props) {



  let initialState = {
    name: '', email: "", phone_number: '', password: ''
  }
  const [filterText, setFilterText] = React.useState('');
  const [searchValue, setSearchValue] = useState("")
  const [date, setDate] = useState("")
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)

  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState([]);

  const onChangeFilter = (e) => {
    setFilterText(e)

  }
  const delivery_columns = [
    {
      sortable: true,
      name: 'Packages Sent',
      minWidth: '250px',
      selector: row => (<>
        {row.packages.map((pack, i) => (
          <div key={i} className='py-2' onClick={() => { setShowModal(true); setItem(row.packages) }}>
            {pack.packageName}
          </div>
        ))}

      </>)
    },

    {
      sortable: true,
      name: 'Total Fee Paid',
      minWidth: '250px',
      selector: row => row.total_payment
    },

    {
      sortable: true,
      name: 'Reciept',
      minWidth: '250px',
      selector: row => row.receipt_no
    },

    {
      sortable: true,
      name: 'Seller',
      minWidth: '150px',
      selector: row => row.businessId?.name
    },
    {
      sortable: true,
      name: 'Seller',
      minWidth: '150px',
      selector: row => <>
      <button onClick={() => { setShowModal(true); setItem(row.packages) }}>View Details  </button>
      </>
    },


  ]

  const subHeaderComponentMemo = React.useMemo(() => {

    return (
      <>
        <Search_filter_component
          onChangeFilter={onChangeFilter}

          searchValue={searchValue}
          date={date}
          showModal={showModal}
          download={() => DownloadFile(() =>
            props.FetchAdmins({ date, limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_users`
          )}
        />


      </>
    );
  }, [searchValue, date, showModal]);

  useEffect(() => {
    props.getParcels({ limit: 10 })
  }, [])

  return (
    <Layout>
      <div className=" mx-2">
        <DataTable
          title=" Agent to Agent Delivery"
          columns={delivery_columns}
          data={props.packages}
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

      <div className=" mx-2 my-10">
        <DataTable
          title="Door Step Delivery"
          columns={door_step_columns}
          data={props.to_door_packages}
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
      <div className=" mx-2 my-10">
        <DataTable
          title="Rent A shelf Delivery"
          columns={rent_shelf_columns}
          data={props.rent_shelf}
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

      <PackageDetail
        show={showModal}
        data={item}
        // changeInput={(e) => changeInput(e)}
        // submit={() => submit()}
        toggle={() => setShowModal(false)}
      />

    </Layout>
  )
}

Users.propTypes = {}


const mapStateToProps = (state) => {
  return {

    packages: state.PackageDetails.packages,
    loading: state.PackageDetails.loading,
    to_door_packages: state.PackageDetails.to_door_packages,
    rent_shelf: state.PackageDetails.rented_shelf_packages
    // error: state.userDetails.error,
  };
};

export default connect(mapStateToProps, { getParcels })(Users)

