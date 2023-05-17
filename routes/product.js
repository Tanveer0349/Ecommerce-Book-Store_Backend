const express=require('express');
const { create,read,remove,update,getProducts,getRelatedProducts,listSearch, listProductCategories, listBySearch, photo } = require('../controllers/product');
const { requireSignin, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const router=express.Router();

router.get('/search', listSearch);
router.get('/:productId',read);
router.get('/',getProducts);
router.get('/related/:productId',getRelatedProducts);
router.get('/photo/:id',photo);
router.delete('/:productId',requireSignin,isAdmin,remove);
router.put('/:productId',requireSignin,isAdmin,update);
router.post('/',requireSignin,isAdmin,create);
router.post('/by/search',listBySearch);


// router.param('userId',userById)
// router.get('/categories',listProductCategories);

module.exports=router;