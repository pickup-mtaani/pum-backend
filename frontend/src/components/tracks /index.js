import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { get_payments } from '../../redux/actions/riders.actions'

import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
import { io } from 'socket.io-client'
const socket = io("localhost:4000");
function Tracks(props) {

  const columns = [

    {
      sortable: true,
      name: 'Phone number',
      minWidth: '250px',
      selector: row => row[0]?.value
    },
    {
      sortable: true,
      name: 'Transaction Code',
      minWidth: '250px',
      wrap: true,
      selector: row => row.log
    },
    {
      sortable: true,
      name: 'amount',
      minWidth: '225px',
      selector: row => row.delivery_rate
    },

  ]

  const [searchValue, setSearchValue] = useState("")

  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0);
  const [cords, setCords] = React.useState({});
  const [showModal, setShowModal] = useState(false);
  const [Mpesadata, setMData] = useState([]);
  // const filteredItems = props.riders.filter(
  //   item => item.customerName.toLowerCase().includes(filterText.toLowerCase()),
  // );
  const onChangeFilter = (e) => {
    // setFilterText(e)
    // const filtered = filteredItems.filter(
    //   item => item.rider_name && item.rider_name.toLowerCase().includes(filterText.toLowerCase()),
    // );
    // setFilterData(filtered)
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
  const start_rider = () => {
    socket.on('connection');
    socket.emit('start-ride', { rider_id: '12345' });
    socket.on('room-created', data => {
      console.log('Room created: ', data);
    });
  }
  useEffect(() => {
    socket.on('connection');
    // socket.emit('start-ride', { rider_id: '12345' });
    // socket.on('room-created', data => {
    //   console.log('Room created: ', data);
    // });


    socket.emit('track_rider', { rider_id: '12345', user_id: 344555 });

    socket.on('user-joined', data => {
      console.log('user joined!', data);
    });

    socket.on('get-users', data => {
      console.log('Get users:', data);
    });


    socket.on('position-changed', async ({ coordinates }) => {
      console.log('coordinates', coordinates);
      setCords(coordinates)
    });

  })


  // if (props?.payments[0]) console.log(JSON.parse(props?.payments[0]?.log)?.Body?.stkCallback?.CallbackMetadata);

  console.log(Mpesadata[0])
  return (
    <Layout>
      <div className=" mx-2">
        <button onClick={() => start_rider()}>start Ride</button>
       <h1>latitude:{cords.latitude}</h1>
       <h1>Longitude:{cords.longitude}</h1>
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

export default connect(mapStateToProps, { get_payments })(Tracks)

