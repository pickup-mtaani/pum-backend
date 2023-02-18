const moment = require("moment");
const axios = require("axios");

const handleOAuth = async () => {};

const handleTransactionQuery = async ({ transactionId, phone }) => {
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
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRETE}`
    ).toString("base64");

    var config = {
      method: "get",
      url: `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      headers: {
        Authorization: `Basic ${encode}`,
      },
    };
    const r = await axios(config);

    console.log("TRANSACTION QUERY: ", r?.data);

    const query_response = await axios.get(
      `${process.env.MPESA_BASE_URL}/mpesa/transactionstatus/v1/query`,
      {
        BusinessShortCode: process.env.MPESA_SHORT_CODE,
        // SecurityCredential: new Buffer.from(
        //   `${process.env.MPESA_SHORT_CODE}${process.env.MPESA_CONSUMER_PASSKEY}${timestamp}`
        // ).toString("base64"),
        CommandID: "TransactionStatusQuery",
        TransactionID: transactionId,
        PartyA: process.env.MPESA_SHORT_CODE,
        IdentifierType: "4",
        ResultURL: `${process.env.BASE_URL}/api/transaction_query_callback`,
        QueueTimeOutURL: `${process.env.BASE_URL}/api/transaction_timeout_callback`,
        Remarks: "Confirm payment",
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
    console.log("AUTH ERROR:", JSON.stringify(error));
  }

  // console.log("TRANSACTION QUERY: ", query_response);

  // return query_response?.data
};

module.exports = handleTransactionQuery;
