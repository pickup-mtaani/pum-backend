
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: "pickup_db"
});


connection.connect((error) => {
    if (error) {
        console.log(error);
        throw error;
    }
    console.log('Mysql db Connected');
});

module.exports = connection