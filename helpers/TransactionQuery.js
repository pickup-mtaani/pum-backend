const createConnection = require("../mysql/Mysql");

const handleTransactionQuery = async ({ transactionId }) => {
  try {
    const connection = createConnection();
    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to database: ", err);
      } else {
        console.log("Connected to MYSQL!");
      }
    });

    connection.query(
      `SELECT * FROM mpesa_data where TransID='RBL15O0FCP'`,
      (err, results) => {
        if (err) {
          console.error("Error selecting from database: ", err);
          return { error: err?.message, data: null, success: false };
        } else {
          console.log("RESULTS:", results);

          if (results[0]?.id && results[0]?.TransID === transactionId) {
            return { successful: true, message: "Transaction successful" };
          } else {
            return { successful: false, message: "Transaction not successful" };
          }
        }
      }
    );

    connection.end();
  } catch (error) {
    console.log(
      "TRANSACTION QUERY ERROR ERROR:",
      JSON.stringify(error?.response?.data)
    );
  }

  // return query_response?.data
};

module.exports = handleTransactionQuery;
