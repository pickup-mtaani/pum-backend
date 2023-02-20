import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'

import { get_zone_prices, update_zone_prices, create_zone_prices, delete_zone_prices } from '../../../redux/actions/destinations.actions'

import Search_filter_component from '../../common/Search_filter_component'
import { DownloadFile } from '../../common/helperFunctions'
import Add_Zone_Price from './add.modal'
import ConfirmModal from '../../confirm'
function ZonePricing(props) {

  let initialState = {
    name: '', description: "", price: '', _id: null
  }

  const [item, setItem] = useState(initialState);
  const [showdelete, setShowdelete] = useState(false);

  const columns = [
    {
      sortable: true,
      name: 'Name',
      minWidth: '10px',
      selector: row => row.name

    },
    {
      sortable: true,
      name: 'description',
      minWidth: '30px',
      wrap: true,
      selector: row => row.description
    },
    {
      sortable: true,
      name: 'Price',
      minWidth: '10px',
      selector: row => row.price
    },

    {
      sortable: true,
      name: 'Action',
      minWidth: '400px',
      selector: row => (
        <div className='flex gap-x-2'>
          <div className='px-2 bg-slate-300 my-1 rounded-md py-2'
            onClick={() => {
              setItem({ name: row.name, description: row.description, price: row.price, _id: row._id });
              setShow(true)
            }}>Edit</div>
          <div className='px-2 bg-slate-300 my-1 rounded-md py-2'
            onClick={() => {
              setShowdelete(true)
              setItem({ name: row.name, description: row.description, price: row.price, _id: row._id });
              setShowdelete(true)
            }}
          >Delete</div>
        </div>
      )
    },
  ]
  const changeInput = (e) => {
    const { name, value } = e.target !== undefined ? e.target : e;
    setItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const submit = async () => {
    await props.create_zone_prices(item)
    await fetch()
    setItem(initialState)
    setShow(false)

  }

  const update = async () => {
    await props.update_zone_prices(item, item._id)
    await fetch()
    setItem(initialState)
    setShow(false)

  }
  const [searchValue, setSearchValue] = useState("")

  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);

  const [show, setShow] = useState(false);

  const [Mpesadata, setMData] = useState([]);

  const onChangeFilter = (e) => {

  }
  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <>
        <Search_filter_component
          onChangeFilter={onChangeFilter}
          searchValue={searchValue}
          download={() => DownloadFile(() =>
            fetch({ limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_users`
          )}
        />
        <div className='px-2 bg-primary-500 my-1 rounded-md py-1 mx-2' onClick={() => setShow(true)}>Add New Zone Price </div>

      </>
    );
  }, [searchValue]);

  const fetch = async () => {
    let r = await props.get_zone_prices()
    return r

  }
  useEffect(() => {

    fetch()

  }, [])


  return (

    <div className=" mx-2">
      <ConfirmModal
        msg={`Are you sure you want to Delete ${item.name}`}
        show={showdelete}

        Submit={async () => {
          await props.delete_zone_prices(item._id);
          await fetch();
          setShowdelete(false);
        }}
      />
      <DataTable
        // title=" Agent to Agent Delivery"
        columns={columns}
        data={props.zone_pricing}
        pagination
        paginationServer
        // progressPending={props.loading}
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        // onChangePage={handlePageChange}
        paginationTotalRows={totalRows}
      // onChangeRowsPerPage={handlePerRowsChange}
      />

      <Add_Zone_Price
        show={show}
        changeInput={(e) => changeInput(e)}
        item={item}
        submit={() => submit()}
        update={() => update()}
        // resetPaginationToggle={resetPaginationToggle}
        toggle={() => {
          setShow(false);
          setItem(initialState)
        }}
      />
    </div>

  )
}


const mapStateToProps = (state) => {
  return {

    zone_pricing: state.Destination.zone_pricing,

    loading: state.Destination.loading,


  };
};

export default connect(mapStateToProps, { get_zone_prices, update_zone_prices, create_zone_prices, delete_zone_prices })(ZonePricing)

