import moment from "moment";

export const rent_shelf_columns = [

    {
        sortable: true,
        name: 'Reciept',
        minWidth: '250px',
        style: {
            backgroundColor: 'green',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
        selector: row => row.receipt_no
    },
    {
        sortable: true,
        name: 'Name',
        minWidth: '250px',
        style: {
            backgroundColor: 'green',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
        selector: row => row.packageName
    },
    {
        sortable: true,
        name: 'Stored At ',
        minWidth: '250px',
        style: {
            backgroundColor: 'green',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
        selector: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
        sortable: true,
        name: 'Collected ',
        minWidth: '250px',
        style: {
            backgroundColor: 'green',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
        selector: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },



]
export const rent_shelf_expired_columns = [

    {
        sortable: true,
        name: 'Reciept',
        minWidth: '250px',
        style: {
            backgroundColor: 'pink',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
        selector: row => row.receipt_no
    },
    {
        sortable: true,
        name: 'Name',
        minWidth: '250px',
        style: {
            backgroundColor: 'pink',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
        selector: row => row.state
    },
    {
        sortable: true,
        name: 'Stored At ',
        minWidth: '250px',
        style: {
            backgroundColor: 'pink',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
        selector: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
        sortable: true,
        name: 'Expected Collections ',
        minWidth: '250px',
        style: {
            backgroundColor: 'pink',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
        selector: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },



]
export const rent_shelf_declined_columns = [

    {
        sortable: true,
        name: 'Reciept',
        minWidth: '250px',
        style: {
            backgroundColor: 'red',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
        selector: row => row.receipt_no
    },
    {
        sortable: true,
        name: 'Name',
        minWidth: '250px',
        style: {
            backgroundColor: 'red',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
        selector: row => row.packageName
    },
    {
        sortable: true,
        name: 'Stored At ',
        minWidth: '250px',
        style: {
            backgroundColor: 'red',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
        selector: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
        sortable: true,
        name: 'Reasons',
        minWidth: '250px',
        style: {
            backgroundColor: 'red',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
        selector: row => (<></>),
    },



]