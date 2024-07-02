const router=require('express').Router();
const { createPool } = require('mysql');
const setup=require('../db_setup')

const sha=require('sha256');

// 회원가입 화면 보기
router.get('/account/enter',(req,res)=>{
    res.render('enter.ejs');
})

// 회원가입 처리
router.post('/account/save',async(req,res)=>{
    const{mongodb,mysqldb}=await setup();
    mongodb.collection('account')
        .findOne({userid:req.body.userid})
        .then(result=>{
            if(result){
                res.render('enter.ejs',{data:{msg:'ID가 중복되었습니다.'}})
            } else{
                const generateSalt=(length=16)=>{
                    const crypto=require('crypto');
                    return crypto.randomBytes(length).toString('hex');
                };
                
                const salt=generateSalt();
                req.body.userpw=sha(req.body.userpw+salt);
                mongodb.collection('account')
                //{userid: ,userpw: , username:}
                    .insertOne(req.body)
                    .then(result=>{
                        if(result){
                            console.log('회원가입 성공!');
                            const sql=`INSERT INTO UserSalt(userid,salt)
                                        VALUES (?,?)`;
                            mysqldb.query(sql,[req.body.userid,salt],
                                (err,rows, fields)=>{
                                    if(err){
                                        console.log(err);
                                    } else{
                                        console.log('salt 저장 성공');
                                    }
                                });
                            res.redirect('/');
                        } else{
                            console.log('회원가입 실패')
                            res.render('enter.ejs',{data:{alertMsg:'회원가입 실패'}})
                        }
            })
                    .catch(err=>{
                        console.log(err);
                        res.render('enter.ejs',{data:{alertMsg:'회원가입 실패'}})
                    });
            }
        })
        .catch(err=>{
            console.log(err);
            res.render('enter.ejs',{data:{alertMsg:'회원가입 실패'}})
        });

})

// router.get('/account/login',async(req,res)=>{
//     console.log('GET /login 처리시작');유0
//     try{
//         const{mongodb,mysqldb}=await setup();
//         res.send('로그인화면 : DB 사용 가능');
//     }catch (err){
//         res.status(500).send('DB 실패');
//     }
// });

// 로그인 페이지를 서버에서 get 과정을 줄임 -> 성능 향상
router.post('/account/login',async(req,res)=>{
    console.log(req.body);
    const { mongodb, mysqldb } = await setup();
    mongodb.collection('account')
        .findOne({userid:req.body.userid})
        .then(result=>{
            if(result){
                sql=`SELECT salt from UserSalt WHERE userid=?`
                mysqldb.query(sql,[req.body.userid],
                    (err, rows, fields)=>{
                        const salt=rows[0].salt;
                        const hashPw=sha(req.body.userpw+salt);
                        if(result.userpw==hashPw){
                            //login ok
                            req.body.userpw=hashPw
                            req.session.user=req.body;      // serialize
                            res.cookie('uid',req.body.userid);
                            res.render('index.ejs');
                        }else{
                            //pw fail
                            res.render('index.ejs',{data:{alertMsg:'다시 로그인 해주세요'}});
                        }
                    });
            } else{
                // login fail
                res.render('index.ejs',{data:{alertMsg:'다시 로그인 해주세요'}});
            }   
        })
        .catch(err=>{
            //login fail
            res.render('index.ejs',{data:{alertMsg:'다시 로그인 해주세요'}});
        });
});

router.get('/account/logout',(req,res)=>{
    req.session.destroy();
    res.render('index.ejs');
});

module.exports=router;