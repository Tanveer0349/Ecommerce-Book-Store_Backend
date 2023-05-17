const express=require('express');
const router=express.Router();
const {userById,read,update}=require('../controllers/user');
const { requireSignin, isAdmin } = require('../controllers/auth');

router.get('/:userId',read)
router.put('/:userId',update)
router.param('userId',userById)
module.exports=router;