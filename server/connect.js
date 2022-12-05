const mysql = require('mysql')
const config = require('dotenv').config();

var connection = mysql.createConnection({
    host: config.parsed.HOST,
    database: config.parsed.DB,
    user: config.parsed.USER,
    password: config.parsed.PW,
    insecureAuth : true
});

module.exports = connection;