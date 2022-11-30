import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { FetchUsers } from '../../redux/actions/auth.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import { Link } from 'react-router-dom'
import Layout from '../../views/Layouts'
function Products(props) {
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
      name: 'Name',
      minWidth: '225px',
      selector: row => row.product_name

    },
    {
      sortable: true,
      name: 'Qty',
      minWidth: '50px',
      maxWidth: '70px',
      selector: row => row.qty
    },
    {
      sortable: true,
      name: 'colors',
      minWidth: '250px',
      selector: (row) => (
        <div className="flex gap-x-1">
          {row.colors.map((color, i) => (
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: color, borderColor: "black", borderWidth: "1px" }} ></div>
          ))}
        </div>
      )
    },
    {
      sortable: true,
      name: 'Price',
      minWidth: '150px',
      selector: row => row.price
    }
  ]
  //   const filteredItems = props.P.filter(
  //     item => item.f_name && item.f_name.toLowerCase().includes(filterText.toLowerCase()),
  //   );
  const onChangeFilter = (e) => {
    setFilterText(e)
    // const filtered = filteredItems.filter(
    //   item => item.title && item.title.toLowerCase().includes(filterText.toLowerCase()),
    // );
    // setFilterData(filtered)
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
    // props.FetchUsers({ date: date })
  }, [])

  return (
    <div className="w-full mx-1">
      <DataTable
        //title="PortFolio Reports"
        columns={serverSideColumns}
        data={props.data}
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
  )
}

Products.propTypes = {}


const mapStateToProps = (state) => {
  return {
    users: state.userDetails.users,
    // lastId: state.userDetails.lastId,
    loading: state.userDetails.loading,

  };
};

export default connect(mapStateToProps, { FetchUsers })(Products)

