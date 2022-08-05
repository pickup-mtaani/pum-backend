import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { getParcels } from '../../redux/actions/package.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'

function Users(props) {

  const columns = [
    {
      sortable: true,
      name: 'Package Name',
      minWidth: '250px',
      selector: row => row.packageName
    },
    {
      sortable: true,
      name: 'Package value',
      minWidth: '250px',
      selector: row => row.package_value
    },
    {
      sortable: true,
      name: 'Reciept',
      minWidth: '250px',
      selector: row => row.receipt_no
    },
    {
      sortable: true,
      name: 'Customer Full Name',
      minWidth: '225px',
      selector: row =>row.customerName},
    {
      sortable: true,
      name: 'Customer Phone Number',
      minWidth: '250px',
      selector: row => row.customerPhoneNumber
    },
   
    {
      sortable: true,
      name: 'Reciever',
      minWidth: '150px',
      selector: row => row.receieverAgentID?.name
    },
    {
      sortable: true,
      name: 'Sender',
      minWidth: '150px',
      selector: row => row.senderAgentID?.name
    },
    {
      sortable: true,
      name: 'Seller',
      minWidth: '150px',
      selector: row => row.businessId?.name
    },
   
  ]
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
  const [item, setItem] = useState(initialState);
  const filteredItems = props.packages.filter(
    item => item.customerName.toLowerCase().includes(filterText.toLowerCase()),
  );
  const onChangeFilter = (e) => {
    setFilterText(e)
    const filtered = filteredItems.filter(
      item => item.customerName && item.customerName.toLowerCase().includes(filterText.toLowerCase()),
    );
    setFilterData(filtered)
  }
  const changeInput = (e) => {
    const { name, value } = e.target !== undefined ? e.target : e;
    setItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  const filter_BY_date = async (e) => {

    await props.FetchAdmins({ date: new Date(e) })

  }

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
    props.getParcels()
  }, [])

  return (
    <Layout>
      <div className=" mx-2">
        <DataTable
          // title=""
          columns={columns}
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
  
    packages: state.PackageDetails.packages,
    loading: state.PackageDetails.loading
    // error: state.userDetails.error,
  };
};

export default connect(mapStateToProps, { getParcels })(Users)

