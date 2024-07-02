const router=require('express').Router();
const setup=require('../db_setup');
const sha=require('sha256');

router.get('/post/list',async(req,res)=>{
    const {mongodb}=await setup();
    list(mongodb,req,res)
});
function list(mongodb,req,res){
    mongodb.collection('post')
        .find().toArray()
        .then(result=>{
            //console.log(result);
            res.render('list.ejs',{data:result});
        })
}

module.exports = router;