import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_payments } from '../../redux/actions/riders.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
import { io } from 'socket.io-client'
import moment from 'moment'
const socket = io("localhost:4000");
function Payments(props) {

  const columns = [

    {
      sortable: true,
      name: 'Phone number',
      minWidth: '10px',

      selector: row => row.phone_number
    },
    {
      sortable: true,
      name: 'Transaction Code',
      minWidth: '100px',
      wrap: true,
      selector: row => row.MpesaReceiptNumber
    },
    {
      sortable: true,
      name: 'amount',
      minWidth: '105px',
      maxWidth: '50px',
      selector: row => row.amount
    },
    {
      sortable: true,
      name: 'Payment BY',
      minWidth: '105px',
      selector: row => <>{row.user?.l_name} {row.user?.f_name}</>
    },
    {
      sortable: true,
      name: 'Customer phone Number',
      minWidth: '105px',
      selector: row => <>{row.user?.phone_number}</>
    },
    {
      sortable: true,
      name: 'state',
      minWidth: '105px',
      wrap: true,
      selector: row => <div className="flex items-between " style={{ color: row.ResultDesc !== "The service request is processed successfully." ? "red" : "green" }}>
        {row.ResultDesc}
        
      </div>
    },
    {
      sortable: true,
      name: 'Date Paid',
      minWidth: '105px',
      selector: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },

  ]

  const [searchValue, setSearchValue] = useState("")

  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);
  const [showModal, setShowModal] = useState(false);
  const [Mpesadata, setMData] = useState([]);

  const onChangeFilter = (e) => {
 
  }
  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <>
        <Search_filter_component
          onChangeFilter={onChangeFilter}

          searchValue={searchValue}

          showModal={showModal}
          download={() => DownloadFile(() =>
            props.FetchAdmins({ limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_users`
          )}
        />


      </>
    );
  }, [searchValue, showModal]);

  useEffect(() => {
    props.get_payments()

  }, [])

  // useEffect(() => {
  //   socket.on('connection');
  //   // socket.emit('start-ride', { rider_id: '12345' });
  //   // socket.on('room-created', data => {
  //   //   console.log('Room created: ', data);
  //   // });


  //   socket.emit('track_rider', { rider_id: '12345', user_id: 344555 });

  //   socket.on('user-joined', data => {
  //     console.log('user joined!', data);
  //   });

  //   socket.on('get-users', data => {
  //     console.log('Get users:', data);
  //   });


  //   socket.on('position-changed', async ({ coordinates }) => {
  //     console.log('coordinates', coordinates);
  //   });

  // })


  // if (props?.payments[0]) console.log(JSON.parse(props?.payments[0]?.log)?.Body?.stkCallback?.CallbackMetadata);

  return (
    <Layout>
      <div className=" mx-2">
        <DataTable
          // title=" Agent to Agent Delivery"
          columns={columns}
          data={props.payments}
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


const mapStateToProps = (state) => {
  return {

    payments: state.ridersDetails.payments,
    loading: state.ridersDetails.loading,
    // error: state.userDetails.error,
  };
};

export default connect(mapStateToProps, { get_payments })(Payments)

