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

  ]

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


      </>
    );
  }, [searchValue, date]);

  useEffect(() => {
  }, [])
  return (
    <div className="w-full mx-1">
      <DataTable
        title={`${props.name}\`s Products`}
        columns={serverSideColumns}
        data={props.products}
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

  };
};

export default connect(mapStateToProps, { get_seller_products })(Products)

