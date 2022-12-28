import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_signatures, Post } from '../../redux/actions/routes.actions'

import Search_filter_component from '../common/Search_filter_component'
import Layout from '../../views/Layouts'
import { Sellers_columns } from './data'

function Users(props) {
  let initialState = {
    name: '', zone: "", rider: '',
  }
  const [filterText, setFilterText] = React.useState('');
  const [searchValue, setSearchValue] = useState("")
  const [routes, setData] = useState([])
  const [date, setDate] = useState("")
  const [zones, setZones] = useState([])
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState(initialState);
  const filteredItems = routes.filter(
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
  const fetch = async () => {

    let routes = await props.get_signatures()

    setData(routes)

  }
  useEffect(() => {
    fetch()

  }, [])

  return (
    <Layout>
      <div className=" mx-2">
        <DataTable
          // title=""
          columns={Sellers_columns}
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

export default connect(mapStateToProps, { get_signatures, Post, })(Users)

