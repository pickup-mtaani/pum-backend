import { Link } from "react-router-dom";

export const Sellers_columns = [
    {
      sortable: true,
      name: 'Full Name',
      minWidth: '225px',
      selector: row => (
        <Link to={`/seller/${row.name}`}
          state={{ id: row._id }}
        >
          {`${row.name}`}</Link>
      )
    },
    {
      sortable: true,
      name: 'Email',
      minWidth: '250px',
      selector: row => row.email
    },
    {
      sortable: true,
      name: 'Phone Number',
      minWidth: '150px',
      selector: row => row.phone_number
    }
  ]