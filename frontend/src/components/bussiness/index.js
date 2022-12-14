import React, { useEffect, useState, useRef } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_business, activateShelf } from '../../redux/actions/bussiness.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
import AssignedPackModal from './AssignedPackModal'
import { Link } from 'react-router-dom'
import ConfirmModal from '../confirm'


function Users(props) {


  const [viewPoints, setViewPoints] = useState({
    width: "100vh", height: "800px", latitude: -1.286389, longitude: 36.817223, zoom: 12
  })
  const [filterText, setFilterText] = React.useState('');
  const [searchValue, setSearchValue] = useState("")
  const [date, setDate] = useState("")
  const [show, setShow] = useState(false)
  const [id, setId] = useState([])
  const [popupMark, setlocapopup] = useState({

  })
  const [showModal, setShowModal] = useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)

  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);
  const [data1, setData] = React.useState([]);

  const [item, setItem] = useState([]);

  const onChangeFilter = (e) => {
    setFilterText(e)

  }
  const conditionalRowStyles = [
    // {
    //   when: row => row.has_shelf,
    //   style: {
    //     backgroundColor: '#dbdbdb',
    //     color: 'white',
    //     '&:hover': {
    //       cursor: 'pointer',
    //     },
    //   },
    // },
    // {
    //   when: row => row.request_shelf,
    //   style: {
    //     backgroundColor: '#d5d3e5',
    //     color: 'white',
    //     '&:hover': {
    //       cursor: 'pointer',
    //     },
    //   },
    // },

  ];

  const columns = [
    {
      sortable: true,
      name: ' Name',
      minWidth: '250px',
      selector: row => (
        <>{row.name}</>
      )
    },


    {
      sortable: true,
      name: 'Action',
      minWidth: '250px',
      selector: row => (
        <>
          {row.request_shelf && <div onClick={() => activate(row)}>
            Activate rent a shelf
          </div>}
        </>

      )
    }

  ]

  const activate = async (data) => {

    setId(data._id)
    setShow(true)
    await props.activateShelf(data._id)
    await props.get_business()
  }

  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <>
        <Search_filter_component
          onChangeFilter={onChangeFilter}

          searchValue={searchValue}
          date={date}
          download={() => DownloadFile(() =>
            props.FetchAdmins({ date, limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_users`
          )}
        />


      </>
    );
  }, [searchValue, date,]);
  const fetch = async () => {
    let result = await props.get_business()
    setData(result)

  }
  useEffect(() => {
    fetch()
  }, [])

  return (
    <Layout>
      <div className=" mx-2 ">
        <DataTable
          title="Businesses"
          columns={columns}
          data={data1}
          pagination
          paginationServer
          progressPending={props.loading}
          conditionalRowStyles={conditionalRowStyles}
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
          // onChangePage={handlePageChange}
          paginationTotalRows={totalRows}
        // onChangeRowsPerPage={handlePerRowsChange}
        />

      </div>
      <ConfirmModal
        msg=" Recieve this package"
        show={show}

        Submit={async () => { await props.activateShelf(id); setShow(false); fetch() }}
      />
    </Layout>
  )
}

Users.propTypes = {}


const mapStateToProps = (state) => {
  return {
    agents: state.agentsData.agents,
    riders: state.ridersDetails.riders,
    loading: state.ridersDetails.loading,

  };
};

export default connect(mapStateToProps, { get_business, activateShelf })(Users)

