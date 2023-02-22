const moment = require("moment");
const axios = require("axios");
const queryTransaction = require("../mysql/QueryTransaction");

const handleTransactionQuery = async ({ transactionId }) => {
  try {
    const res = queryTransaction(transactionId);
    console.log("RESPONSE: ", res);
    if (res?.id && res?.TransID === transactionId) {
      return { successful: true, message: "Transaction successful" };
    } else {
      return { successful: false, message: "Transaction not successful" };
    }
  } catch (error) {
    console.log(
      "TRANSACTION QUERY ERROR ERROR:",
      JSON.stringify(error?.response?.data)
    );
  }

  // return query_response?.data
};

module.exports = handleTransactionQuery;
