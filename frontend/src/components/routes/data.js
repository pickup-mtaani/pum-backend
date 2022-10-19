import { Link } from "react-router-dom";

export const Sellers_columns = [
  {
    sortable: true,
    name: ' Name',
    minWidth: '225px',
    selector: row => row.name
  },
  {
    sortable: true,
    name: 'Zonne',
    minWidth: '250px',
    selector: row => row.zone?.name
  },
  {
    sortable: true,
    name: 'Rider',
    minWidth: '150px',
    selector: row => row.rider?.name
  }
]