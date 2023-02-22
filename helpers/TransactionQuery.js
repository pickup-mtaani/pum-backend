const moment = require("moment");
const axios = require("axios");
const queryTransaction = require("../mysql/QueryTransaction");

const handleTransactionQuery = async ({ transactionId }) => {
  try {
    const res = await queryTransaction(transactionId);

    console.log(res);
    return "QUERY";
  } catch (error) {
    console.log(
      "TRANSACTION QUERY ERROR ERROR:",
      JSON.stringify(error?.response?.data)
    );
  }

  // return query_response?.data
};

module.exports = handleTransactionQuery;
