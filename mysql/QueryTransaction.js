const createConnection = require("./Mysql");

function queryTransaction(transactionCode) {
  const connection = createConnection();

  connection.query(
    `SELECT * FROM mpesa_data where TransID='RBLO0FCP'`,
    (err, results) => {
      if (err) {
        console.error("Error selecting from database: ", err);
        return { error: err?.message, data: null, success: false };
      } else {
        console.log("Selected results: ", results);
        return { error: null, data: results, success: true };
      }
    }
  );

  connection.end();
}

module.exports = queryTransaction;
