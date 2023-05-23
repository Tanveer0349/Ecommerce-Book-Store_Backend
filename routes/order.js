const express=require('express');
const router=express.Router();
const { requireSignin,isAdmin } = require('../controllers/auth');
const { create,listOrders,listStatusValues,updateStatus} = require('../controllers/order');
const { pushOrderToHistory } = require('../controllers/user');
const { updateQuantity } = require('../controllers/product');

router.get('/statuses',requireSignin,isAdmin,listStatusValues);
router.get('/list',requireSignin,isAdmin,listOrders);
router.post('/create',requireSignin,pushOrderToHistory,updateQuantity,create);
router.put('/status/:orderId',requireSignin,isAdmin,updateStatus);

module.exports=router;