const express=require('express');
const router=express.Router();
const {requireSignin} =require('../controllers/auth');
const {genToken, processPayment} =require('../controllers/braintree');


router.get('/getToken',requireSignin,genToken)
router.post('/payment',requireSignin,processPayment)

module.exports=router;