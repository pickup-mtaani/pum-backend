const moment = require("moment");
const axios = require("axios");

const handleOAuth = async () => {};

const handleTransactionQuery = async () => {
  let timestamp = moment().format("YYYYMMDDHHmmss");

  // const {data} = await axios.get(
  //     `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
  //     "headers": {
  //         "Authorization": `Basic ${new Buffer.from(`${process.env.MPESA_TRANSACTION_CONSUMER_KEY}:${process.env.MPESA_TRANSACTION_CONSUMER_SECRET}`).toString("base64")}`
  //     }
  // })

  // console.log("TOKEN:", data)
  // return data

  try {
    const encode = new Buffer.from(
      `${process.env.MPESA_TRANSACTION_CONSUMER_KEY}:${process.env.MPESA_TRANSACTION_CONSUMER_SECRET}`
    ).toString("base64");

    var config = {
      method: "get",
      url: "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${encode}`,
      },
    };
    const r = await axios(config);
    console.log(r?.data);

    const query_response = await axios.post(
      process.env.MPESA_TRANSACTION_STATUS_URL,
      {
        Initiator: "testapi",
        SecurityCredential: process.env.MPESA_TRANSACTION_SECURITY_CREDENTIALS,
        CommandID: "TransactionStatusQuery",
        TransactionID: "OEI2AK4Q16",
        PartyA: process.env.MPESA_TRANSACTION_SHORT_CODE,
        IdentifierType: 2,
        ResultURL: `${process.env.MPESA_BASE_URL}/api/transaction_query_callback`,
        QueueTimeOutURL: `${process.env.MPESA_BASE_URL}/api/transaction_timeout_callback`,
        Remarks: "Confirm payment",
        // Occasion: ""
      },
      {
        headers: {
          ["Content-Type"]: "application/json",
          Authorization: `Bearer ${r.data?.access_token}`,
        },
      }
    );

    return query_response.data;
  } catch (error) {
    console.log("AUTH ERROR:", error);
  }

  // console.log("TRANSACTION QUERY: ", query_response);

  // return query_response?.data
};

module.exports = handleTransactionQuery;
