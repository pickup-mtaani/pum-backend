export const delivery_columns = [
    {
      sortable: true,
      name: 'Package Name',
      minWidth: '250px',
      selector: row => row.packageName
    },
    {
      sortable: true,
      name: 'Package Type',
      minWidth: '250px',
      selector: row => (<>{row.isProduct ? "Product" : "Package"}</>)
    },
    {
      sortable: true,
      name: 'Delivery Fee',
      minWidth: '250px',
      selector: row => (<>{row.isProduct ? "200" : "180"}</>)
    },
    {
      sortable: true,
      name: 'Package value',
      minWidth: '250px',
      selector: row => row.package_value
    },
    {
      sortable: true,
      name: 'Reciept',
      minWidth: '250px',
      selector: row => row.receipt_no
    },
    {
      sortable: true,
      name: 'Customer Full Name',
      minWidth: '225px',
      selector: row => row.customerName
    },
    {
      sortable: true,
      name: 'Customer Phone Number',
      minWidth: '250px',
      selector: row => row.customerPhoneNumber
    },

    {
      sortable: true,
      name: 'Reciever Agent',
      minWidth: '150px',
      selector: row => row.receieverAgentID?.name
    },
    {
      sortable: true,
      name: 'Sender Agent',
      minWidth: '150px',
      selector: row => row.senderAgentID?.name
    },
    {
      sortable: true,
      name: 'Seller',
      minWidth: '150px',
      selector: row => row.businessId?.name
    },

  ]
 export const door_step_columns = [
    {
      sortable: true,
      name: 'Package Name',
      minWidth: '250px',
      selector: row => row.packageName
    },
    {
      sortable: true,
      name: 'Package Type',
      minWidth: '250px',
      selector: row => (<>{row.isProduct ? "Product" : "Package"}</>)
    },
    {
      sortable: true,
      name: 'Total Payment',
      minWidth: '250px',
      selector: row => (<>{row.payment_amount}</>)
    },
    {
      sortable: true,
      name: 'Package value',
      minWidth: '250px',
      selector: row => row.package_value
    },
    {
      sortable: true,
      name: 'Reciept',
      minWidth: '250px',
      selector: row => row.receipt_no
    },
    {
      sortable: true,
      name: 'Customer Full Name',
      minWidth: '225px',
      selector: row => row.customerName
    },
    {
      sortable: true,
      name: 'Customer Phone Number',
      minWidth: '250px',
      selector: row => row.customerPhoneNumber
    },
    {
      sortable: true,
      name: 'Payment Options',
      minWidth: '250px',
      selector: row => row.payment_option
    },
    
    {
      sortable: true,
      name: 'Location',
      minWidth: '150px',
      selector: row => row.location
    },
    {
      sortable: true,
      name: 'Destination',
      minWidth: '150px',
      selector: row => row.house_no
    },
    {
      sortable: true,
      name: 'Seller',
      minWidth: '150px',
      selector: row => row.businessId?.name
    },

  ]