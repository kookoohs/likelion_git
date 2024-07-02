const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');
const mysql = require('mysql2');

let mongodb;
let mysqldb;

const setup = async () => { 
    if (mongodb && mysqldb) {
        return { mongodb, mysqldb };
    }

    try {
        const mongoDbUrl = process.env.MONGO_DB_URL;
        const mongoConn = await MongoClient.connect(mongoDbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            tlsAllowInvalidCertificates: true  // TLS/SSL 설정 추가
        });
        mongodb = mongoConn.db(process.env.MONGO_DB);
        console.log("몽고DB 접속 성공");

        mysqldb = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB
        });
        mysqldb.connect((err) => {
            if (err) throw err;
            console.log("MySQL 접속 성공");
        });

        return { mongodb, mysqldb };
    } catch (err) {
        console.error("DB 접속 실패", err);   
        throw err;
    }
};

module.exports = setup;
