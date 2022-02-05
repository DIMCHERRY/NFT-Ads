const mysql = require('mysql2');
const confManager = require('../confManager.js');

class Mysql {
    constructor() {
        const dbConf = confManager.getDBConf();
        this.connection = mysql.createConnection({
            host: dbConf["Host"],
            user: dbConf["User"],
            password: dbConf["Password"],
            database: dbConf["DataBase"]
        });
        //this.connection.connect();
        //console.log("Connected!");
    }
    end() {
        this.connection.end();
    }
    async testAsync() {
        let results = await this.connection.promise().query('SELECT 1 + 1 AS solution');
        return results[0];
    }
    test(callback) {
        this.connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
            if (err) throw err
            return callback(rows[0].solution);
        })
    }
    insertOneUser(_address, _userdata) {
        var sql = "INSERT INTO users (address, user_data) VALUES (?, ?)";
        this.connection.query(sql, [_address, _userdata], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    }
    queryUserByAddress(_address, callback) {
        this.connection.query('SELECT user_data FROM users where address = ?', [_address], function (err, rows, fields) {
            if (err) throw err
            return callback(rows[0].user_data);
        })
    }
    insertOneToken(_image, address) {
        var sql = "INSERT INTO token (`img_ipfs_url`, `creator_address`) VALUES (?, ?)";
        this.connection.query(sql, [_image, address], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    }
    queryTokenByAddress(_address, callback) {
        this.connection.query('SELECT id, img_ipfs_url FROM token where creator_address = ?', [_address], function (err, rows, fields) {
            if (err) throw err
            console.log(rows[0]);
            return callback(rows[0].id);
        })
    }
    queryTokenByID(_id, callback) {
        this.connection.query('SELECT token_content, img_ipfs_url FROM token where id = ?', [_id], function (err, rows, fields) {
            if (err) throw err
            if (rows.length == 0) {
                console.log("query returns none");
                return;
            }
            console.log(rows[0]);
            return callback(rows[0].token_content, rows[0].img_ipfs_url);
        })
    }
}

const mysqlConn = new Mysql()

module.exports = mysqlConn