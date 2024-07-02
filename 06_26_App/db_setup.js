const dotenv = require('dotenv').config();  // 최상단에 위치
const { MongoClient } = require('mongodb');
const mysql = require('mysql');

let mongodb;
let mysqldb;

const setup = async () => { 
    if (mongodb && mysqldb) {
        console.log('DB already setup');
        return { mongodb, mysqldb };
    }

    try {
        // 환경 변수 출력
        console.log('MONGO_URL:', process.env.MONGO_DB_URL);
        console.log('MONGO_DB:', process.env.MONGO_DB);
        console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
        console.log('MYSQL_USER:', process.env.MYSQL_USER);
        console.log('MYSQL_PW:', process.env.MYSQL_PW);
        console.log('MYSQL_DB:', process.env.MYSQL_DB);

        const mongoUrl = process.env.MONGO_DB_URL;
        const mongoConn = await MongoClient.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        mongodb = mongoConn.db(process.env.MONGO_DB);
        console.log('몽고 DB 접속 성공...');

        mysqldb = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PW,
            database: process.env.MYSQL_DB,
        });
        mysqldb.connect();  
        console.log('MySQL 접속 성공...');

        return { mongodb, mysqldb };
    } catch (err) {
        console.error("DB 접속 실패", err);
        throw err;
    }
};

module.exports = setup;
