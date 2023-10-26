const prop = require('./db_proberties');
const mysql = require('mysql2');

module.exports = {
    getConnection : ()=>{
        return mysql.createPool(prop)
    }
}