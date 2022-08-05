import React, { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import Search_filter_component from "../common/Search_filter_component";
import { DownloadFile } from "../common/helperFunctions";
import { get_seller_products } from "../../redux/actions/products.actions";

import Image_modal from "./modals/image_modal";
import { Link } from "react-router-dom";
function Packages(props) {
  const [filterText, setFilterText] = React.useState("");
  const [searchValue, setSearchValue] = useState("");
  const [image, setImage] = useState([]);
  const [active, setActive] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [date, setDate] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [RowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);

 

   const columns = [
     {
       sortable: true,
       name: "Package Name",
       minWidth: "250px",
       selector: (row) => row.packageName,
     },
     {
       sortable: true,
       name: "Package value",
       minWidth: "250px",
       selector: (row) => row.package_value,
     },
     {
       sortable: true,
       name: "Reciept",
       minWidth: "250px",
       selector: (row) => row.receipt_no,
     },
     {
       sortable: true,
       name: "Customer Full Name",
       minWidth: "225px",
       selector: (row) => row.customerName,
     },
     {
       sortable: true,
       name: "Customer Phone Number",
       minWidth: "250px",
       selector: (row) => row.customerPhoneNumber,
     },

     {
       sortable: true,
       name: "Reciever",
       minWidth: "150px",
       selector: (row) => row.receieverAgentID?.name,
     },
     {
       sortable: true,
       name: "Sender",
       minWidth: "150px",
       selector: (row) => row.senderAgentID?.name,
     },
     {
       sortable: true,
       name: "Seller",
       minWidth: "150px",
       selector: (row) => row.businessId?.name,
     },
   ];
  const onChangeFilter = (e) => {
    setFilterText(e);

    const filtered = props.data.filter(
      (item) =>
        item.product_name &&
        item.product_name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilterData(filtered);
  };

  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <>
        <Search_filter_component
          onChangeFilter={onChangeFilter}
          searchValue={searchValue}
          date={date}
          download={() =>
            DownloadFile(
              () =>
                props.get_seller_products({
                  date,
                  limit: -1,
                  download: true,
                  cursor: props.lastElement,
                  q: searchValue,
                  enabled: true,
                }),
              `${totalRows > 0 ? totalRows : "all"}_products`
            )
          }
        />
      </>
    );
  }, [searchValue, date]);

  useEffect(() => {
    // props.FetchUsers({ date: date })
  }, []);
 
  return (
    <div className="w-full mx-1">
      <DataTable
        //title="PortFolio Reports"
        columns={columns}
        data={props.packages}
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
  );
}

Packages.propTypes = {};

const mapStateToProps = (state) => {
  return {
    products: state.products.products,
    // lastId: state.userDetails.lastId,

    loading: state.userDetails.loading,
    // error: state.userDetails.error,
  };
};

export default connect(mapStateToProps, { })(Packages);
