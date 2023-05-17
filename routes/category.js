const express=require('express');
const { create,categoryById, getCategories, updateCategory, deleteCategory } = require('../controllers/category');
const { requireSignin, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

const router=express.Router();
router.post('/create',requireSignin,isAdmin,create);
router.get('/:id',categoryById);
router.get('/',getCategories);
router.put('/:id',requireSignin,isAdmin,updateCategory);
router.delete('/:id',requireSignin,isAdmin,deleteCategory);
module.exports=router;