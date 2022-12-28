import { Link } from "react-router-dom";

export const Sellers_columns = [
  {
    sortable: true,
    name: 'Package',
    selector: row => row?.package?.packageName
  }, {
    sortable: true,
    name: 'Time',
    selector: row => row.createdAt
  },
  {
    sortable: true,
    name: ' Name',
    selector: row => row.collector_name
  },
  {
    sortable: true,
    name: 'Phone Numner',
    selector: row => row.collector_phone_number
  },

  {
    sortable: true,
    name: 'Signature',
    selector: row => (<>
      <img src={`data:image/png;base64,${row.collector_signature}`} height={60} width={60} alt="" />

    </>)
  }
]