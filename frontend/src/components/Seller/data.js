import { Link } from "react-router-dom";

export const Sellers_columns = [
    {
      sortable: true,
      name: 'Full Name',
      minWidth: '225px',
      selector: row => (
        <Link to={`/seller/${row.f_name}`}
          state={{ id: row._id }}
        >
          {`${row.f_name} ${row.l_name}`}</Link>
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
      name: 'Role',
      minWidth: '250px',
      selector: row => row.role && row.role.name
    },
    {
      sortable: true,
      name: 'Phone Number',
      minWidth: '150px',
      selector: row => row.phone_number
    }
  ]