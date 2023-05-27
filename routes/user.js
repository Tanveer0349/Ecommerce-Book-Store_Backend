const express=require('express');
const router=express.Router();
const {userById,read,update,purchaseHistory}=require('../controllers/user');
const { requireSignin, isAdmin } = require('../controllers/auth');

router.get('/:userId',requireSignin,read)
router.get('/history/:userId',requireSignin,purchaseHistory)
router.put('/:userId',requireSignin,update)
router.param('userId',userById)
module.exports=router;