import { Link } from "react-router-dom";

export const Sellers_columns = [
  {
    sortable: true,
    name: 'Full Name',
    minWidth: '225px',
    selector: row => (
      <Link to={`/seller/${row.f_name}`}
        state={{ id: row._id,name:`${row.f_name} ${row.l_name}` }}
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
  },
  {
    sortable: true,
    name: 'Actions',
    minWidth: '250px',
    selector: (row) => (<Link to={`/seller/${row.f_name}`}
      state={{ id: row._id,name:`${row.f_name} ${row.l_name}` }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </Link>
    )
  },
]