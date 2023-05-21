const express=require('express');
const router=express.Router();
const {requireSignin} =require('../controllers/auth');
const {genToken} =require('../controllers/braintree');


router.get('/getToken',requireSignin,genToken)

module.exports=router;