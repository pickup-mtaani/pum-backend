import { Link } from "react-router-dom";
import moment from "moment";


export const columns = [

  {
    sortable: true,
    name: 'Phone number',
    minWidth: '10px',

    selector: row => row.phone_number
  },
  {
    sortable: true,
    name: 'Transaction Code',
    minWidth: '100px',
    wrap: true,
    selector: row => row.MpesaReceiptNumber
  },
  {
    sortable: true,
    name: 'amount',
    minWidth: '105px',
    maxWidth: '50px',
    selector: row => row.amount
  },
  {
    sortable: true,
    name: 'Payment BY',
    minWidth: '105px',
    selector: row => <>{row.user?.name} {row.user?.f_name}</>
  },
  {
    sortable: true,
    name: 'Customer phone Number',
    minWidth: '105px',
    selector: row => <>{row.user?.phone_number}</>
  },
  {
    sortable: true,
    name: 'state',
    minWidth: '105px',
    wrap: true,
    selector: row => <div className="flex items-between " style={{ color: row.ResultDesc !== "The service request is processed successfully." ? "red" : "green" }}>
      {row.ResultDesc}

    </div>
  },
  {
    sortable: true,
    name: 'Date Paid',
    minWidth: '105px',
    selector: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
  },

]
