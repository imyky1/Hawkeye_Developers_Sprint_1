const prop = require('./db_proberties');
const mysql = require('mysql');

module.exports = {
    getConnection : ()=>{
        return mysql.createConnection(prop)
    }
}