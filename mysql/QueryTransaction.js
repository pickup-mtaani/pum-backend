const createConnection = require("./Mysql");

async function queryTransaction(transactionCode) {
  const connection = createConnection();
  await connection.connect((err) => {
    if (err) {
      console.error("Error connecting to database: ", err);
    } else {
      console.log("Connected to MYSQL!");
    }
  });

  await connection.query(
    `SELECT * FROM mpesa_data where TransID='RBL15O0FCP'`,
    (err, results) => {
      if (err) {
        console.error("Error selecting from database: ", err);
        return { error: err?.message, data: null, success: false };
      } else {
        return { error: null, data: results[0], success: true };
      }
    }
  );

  await connection.end();
}

module.exports = queryTransaction;
