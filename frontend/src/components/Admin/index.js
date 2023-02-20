import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component'
import { connect } from 'react-redux'
import { FetchAdmins, registerUser } from '../../redux/actions/auth.actions'
import Search_filter_component from '../common/Search_filter_component'
import { DownloadFile } from '../common/helperFunctions'
import Layout from '../../views/Layouts'
import { Sellers_columns } from './data'
import Modal from '../common/modal'
import Date_range from './modals/date_range.modal'
import Add_admin from './modals/add_admin.modal'
function Users(props) {
  let initialState = {
    name: '', email: "", phone_number: '', password: ''
  }
  const [filterText, setFilterText] = React.useState('');
  const [searchValue, setSearchValue] = useState("")
  const [date, setDate] = useState("")
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const [RowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0);
  const [data, setFilterData] = React.useState([]);
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState(initialState);
  const filteredItems = props.admins.filter(
    item => item.name.toLowerCase().includes(filterText.toLowerCase()),
  );
  const onChangeFilter = (e) => {
    setFilterText(e)
    const filtered = filteredItems.filter(
      item => item.title && item.title.toLowerCase().includes(filterText.toLowerCase()),
    );
    setFilterData(filtered)
  }
  const changeInput = (e) => {
    const { name, value } = e.target !== undefined ? e.target : e;
    setItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  const filter_BY_date = async (e) => {

    await props.FetchAdmins({ date: new Date(e) })

  }
  const submit = async () => {
    await props.registerUser(item)
    await props.FetchAdmins()
    setItem(initialState)
    setShowModal(false)
  }
  const subHeaderComponentMemo = React.useMemo(() => {

    return (
      <>
        <Search_filter_component
          onChangeFilter={onChangeFilter}

          searchValue={searchValue}
          date={date}
          showModal={showModal}
          download={() => DownloadFile(() =>
            props.FetchAdmins({ date, limit: -1, download: true, cursor: props.lastElement, q: searchValue, enabled: true, }),
            `${totalRows > 0 ? totalRows : "all"}_users`
          )}
        />
        <button onClick={() => setShowModal(true)} className="border py-1 px-2 border-slate-200 mx-2 rounded-md flex gap-x-2 bg-green-200 justify-center items-center"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex justify-center items-center border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>ADD </button>

      </>
    );
  }, [searchValue, date, showModal]);

  useEffect(() => {
    props.FetchAdmins()
  }, [])

  return (
    <Layout>
      <div className=" mx-2">
        <DataTable
          // title=""
          columns={Sellers_columns}
          data={filteredItems}
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
      <Date_range toggle={() => setShowModal(false)} show={showModal} />
      <Add_admin
        show={showModal}
        changeInput={(e) => changeInput(e)}
        submit={() => submit()}
        toggle={() => setShowModal(false)}
      />
    </Layout>
  )
}

Users.propTypes = {}


const mapStateToProps = (state) => {
  return {
    admins: state.userDetails.admins,
    // lastId: state.userDetails.lastId,
    loading: state.userDetails.loading,

  };
};

export default connect(mapStateToProps, { FetchAdmins, registerUser })(Users)

