import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import {
  get_seller_products
} from "../../redux/actions/products.actions";

import Image_modal from './modals/image_modal'
import { Link } from 'react-router-dom'
function Products(props) {
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
      name: 'colors',
      minWidth: '250px',
      selector: (row) => (
        <div className="flex gap-x-1">
          {row.images.map((image, i) => (
            <div style={{ width: 20, height: 20, borderRadius: "20%", borderColor: "black", borderWidth: "1px" }} onClick={() => OPenImagView({ Images: row.images, id: i })} >
              <img src={image} alt="" />
            </div>
          ))}
        </div>
      )
    },
    {
      sortable: true,
      name: 'Price',
      minWidth: '150px',
      selector: row => row.price
    },
    {
      sortable: true,
      name: 'Actions',
      minWidth: '250px',
      selector: (row) => (<Link to={`${row._id}`}
        state={{ id: row._id, product: row }}

      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </Link>
      )
    },
  ]
  //   const filteredItems = props.P.filter(
  //     item => item.f_name && item.f_name.toLowerCase().includes(filterText.toLowerCase()),
  //   );
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
            props.get_seller_products({ date, limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_products`
          )}
        />
        {/* <input type="date" onChange={e => filter_BY_date(e.target.value)} placeholder="Select a date" style={{ marginRight: 20, borderColor: "red" }} /> */}
        {/* <AddButton toggleCanvarse={toggleCanvarse} />
        <FilterContainer array={[{ value: 'status', label: 'Status' }]} changeSelect={changeSelect} 
        /> */}

      </>
    );
  }, [searchValue, date]);

  useEffect(() => {
    // props.FetchUsers({ date: date })
  }, [])
  console.log(props.data)
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
      <Image_modal

        show={showImage}
        image={image}
        active={active}
        toggle={() => setShowImage(false)}
      />

    </div>
  )
}

Products.propTypes = {}


const mapStateToProps = (state) => {
  return {
    products: state.products.products,
    // lastId: state.userDetails.lastId,

    loading: state.userDetails.loading,
    // error: state.userDetails.error,
  };
};

export default connect(mapStateToProps, { get_seller_products })(Products)

