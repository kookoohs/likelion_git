const dotenv=require('dotenv').config();
const{MongoClient}=require('mongodb');
const mysql=require('mysql');

let mongodb;
let mysqldb;

const setup=async()=>{ 
    if(mongodb&&mysqldb){
        console.log('DB already setup');
        return {mongodb,mysqldb};
    }

    try{
        const mongoUrl =process.env.MONGO_URL;
        //비동기적으로 동작! => 기다렸다가 동작해야됨
        const mongoConn=await MongoClient.connect(mongoUrl,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        mongodb=mongoConn.db(process.env.MONGO_DB);
        console.log('몽고 DB 접속 성공...');

        // 비동기 함수 아님
        mysqldb=mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user:process.env.MYSQL_USER,
            password:process.env.MYSQL_PW,
            database:process.env.MYSQL_DB,
        });
        mysqldb.connect();
        console.log('MySQL 접속 성공...');

        return {mongodb,mysqldb};
    } catch(err){
        console.error("DB 접속 실패",err);
        throw err;
    }
};



module.exports=setup;