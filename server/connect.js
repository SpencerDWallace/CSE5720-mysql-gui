const mysql = require('mysql')
const config = require('dotenv').config();

var connection = mysql.createConnection({
    host: config.parsed.HOST,
    database: config.parsed.DB,
    user: config.parsed.USER,
    password: config.parsed.PW,
    insecureAuth : true
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

connection.query(`SELECT table_name FROM information_schema.tables where table_schema = "${config.parsed.DB}"`, function(err, tables){ 
    if (err) throw err;
    connection.tables_internal = [];
    tables.forEach(element => {
        console.log(element?.TABLE_NAME);
        connection.tables_internal.push(element?.TABLE_NAME);
    });
});

module.exports = connection;