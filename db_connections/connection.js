let mysql = require('mysql');

let util = require('util');

let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
	user: 'root',
	password:'123456789',
	database: 'moviesdb'
});




pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
        if (connection) connection.release()
        return
    }
});


pool.query =  util.promisify(pool.query);

module.exports = pool;
