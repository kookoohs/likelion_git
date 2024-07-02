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
        if (!mongoDbUrl) {
            throw new Error("MongoDB URL is not defined in environment variables.");
        }

        const mongoConn = await MongoClient.connect(mongoDbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            tls: true,
            tlsAllowInvalidCertificates: true  // TLS/SSL 설정 추가
        });

        mongodb = mongoConn.db(process.env.MONGO_DB);
        console.log("몽고DB 접속 성공");
    } catch (err) {
        console.error("MongoDB 접속 실패", err);
        throw err;  // MongoDB 연결 실패 시 예외를 던집니다.
    }

    try {
        const mysqlHost = process.env.MYSQL_HOST;
        const mysqlUser = process.env.MYSQL_USER;
        const mysqlPassword = process.env.MYSQL_PASSWORD;
        const mysqlDatabase = process.env.MYSQL_DB;

        if (!mysqlHost || !mysqlUser || !mysqlDatabase) {
            throw new Error("MySQL configuration is not fully defined in environment variables.");
        }

        mysqldb = mysql.createConnection({
            host: mysqlHost,
            user: mysqlUser,
            password: mysqlPassword,
            database: mysqlDatabase
        });

        mysqldb.connect((err) => {
            if (err) throw err;
            console.log("MySQL 접속 성공");
        });

    } catch (err) {
        console.error("MySQL 접속 실패", err);
        throw err;  // MySQL 연결 실패 시 예외를 던집니다.
    }

    return { mongodb, mysqldb };
};

module.exports = setup;
