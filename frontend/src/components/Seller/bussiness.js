import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import {
  get_seller_bussiness
} from "../../redux/actions/bussiness.actions";

import Image_modal from './modals/image_modal'
import { Link } from 'react-router-dom'
function Bussiness(props) {
  const [filterText, setFilterText] = React.useState('');
  const [searchValue, setSearchValue] = useState("")
  const [image, setImage] = useState([])
  const [active, setActive] = useState(0)
  const [showImage, setShowImage] = useState(false)
  const [date, setDate] = useState("")
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);

  const OPenImagView = async (image) => {
    console.log(image)
    setShowImage(true)
    setImage(image.Images)
    setActive(image.id)
  }

  const serverSideColumns = [
    {
      sortable: false,
      name: "Logo",
      minWidth: "5px",
      minWidth: "5px",
      selector: (row) => (
        <img src={row.logo} alt="" height="30px" width="30px" />
      ),
    },
    {
      sortable: true,
      name: "Name",
      selector: (row) => (
        <div onClick={() => props.fetchProducts(row._id)}>{` ${row.name}`}</div>
      ),
    },
    {
      sortable: true,
      name: "Name",
      selector: (row) => (
        <div onClick={() => props.fetchProducts(row._id)}>{` ${row.name}`}</div>
      ),
    },
    {
      sortable: true,
      name: "Stock",
      // minWidth: '50px',
      // maxWidth: '70px',
      selector: (row) => row.what_u_sale,
    },
    // {
    //   sortable: true,
    //   name: 'Location',
    //   minWidth: '250px',

    // },
  ];
  // const filteredItems = props.P.filter(
  //   item => item.f_name && item.f_name.toLowerCase().includes(filterText.toLowerCase()),
  // );
  const onChangeFilter = (e) => {
    setFilterText(e)

    const filtered = props.data.filter(
      item => item.product_name && item.product_name.toLowerCase().includes(filterText.toLowerCase()),
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
          download={() => DownloadFile(() =>
            props.get_seller_bussiness({ date, limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_products`
          )}
        />


      </>
    );
  }, [searchValue, date]);

  useEffect(() => {

  }, [])
  console.log(props.bussinesses[0])
  return (
    <div className="w-full mx-1">
      <DataTable
        //title="PortFolio Reports"
        columns={serverSideColumns}
        data={props.bussinesses}
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
      <Image_modal

        show={showImage}
        image={image}
        active={active}
        toggle={() => setShowImage(false)}
      />

    </div>
  )
}




const mapStateToProps = (state) => {
  return {
    bussinesses: state.bussiness.bussinsses,
    loading: state.bussiness.loading,
    // error: state.userDetails.error,
  };
};

export default connect(mapStateToProps, { get_seller_bussiness })(Bussiness)

