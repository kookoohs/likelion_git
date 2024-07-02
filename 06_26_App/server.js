const dotenv = require('dotenv').config();  // 최상단에 위치
const setup = require('./db_setup');
const express = require('express');

const app = express();

const session = require('express-session');
app.use(session({
    secret: "암호화키",
    resave: false,
    saveUninitialized: false,
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.use('/', require('./routes/account'));
app.use('/', require('./routes/post'));

app.listen(process.env.WEB_PORT, async () => {
    // 환경 변수 출력
    console.log('WEB_PORT:', process.env.WEB_PORT);
    // DB 구축 후 server 준비
    await setup();    // 비동기적으로 작동
    console.log(`${process.env.WEB_PORT} 서버 준비...`);
});
