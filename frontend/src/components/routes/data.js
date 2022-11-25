import { Link } from "react-router-dom";

export const Sellers_columns = [
  {
    sortable: true,
    name: 'Package',
    minWidth: '225px',
    selector: row => row?.package?.packageName
  }, {
    sortable: true,
    name: 'Time',
    minWidth: '225px',
    selector: row => row.createdAt
  },
  {
    sortable: true,
    name: ' Name',
    minWidth: '225px',
    selector: row => row.collector_name
  },
  {
    sortable: true,
    name: 'Phone Numner',
    minWidth: '250px',
    selector: row => row.collector_phone_number
  },

  {
    sortable: true,
    name: 'Signature',
    minWidth: '150px',
    selector: row => (<>
      <img src={`data:image/png;base64,${row.collector_signature}`} height={60} width={60} alt="Red dot" />

    </>)
  }
]