import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_riders } from '../../redux/actions/riders.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'

function Users(props) {

  const columns = [
    {
      sortable: true,
      name: ' Name',
      minWidth: '250px',
      selector: row => row.rider_name
    },
  
    {
      sortable: true,
      name: 'Phone number',
      minWidth: '250px',
      selector: row => row.rider_phone_number
    },
    {
      sortable: true,
      name: 'ID',
      minWidth: '250px',
      selector: row => row.rider_ID_number
    },
    {
      sortable: true,
      name: 'Rate',
      minWidth: '225px',
      selector: row => row.delivery_rate
    },
    {
      sortable: true,
      name: 'Charge Per KM',
      minWidth: '250px',
      selector: row => row.charger_per_km
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
  // const filteredItems = props.riders.filter(
  //   item => item.customerName.toLowerCase().includes(filterText.toLowerCase()),
  // );
  const onChangeFilter = (e) => {
    setFilterText(e)
    // const filtered = filteredItems.filter(
    //   item => item.rider_name && item.rider_name.toLowerCase().includes(filterText.toLowerCase()),
    // );
    // setFilterData(filtered)
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
    props.get_riders()
  }, [])
  return (
    <Layout>
      <div className=" mx-2">
        <DataTable
          // title=" Agent to Agent Delivery"
          columns={columns}
          data={props.riders}
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

    riders: state.ridersDetails.riders,
    loading: state.ridersDetails.loading,
    // error: state.userDetails.error,
  };
};

export default connect(mapStateToProps, { get_riders })(Users)

