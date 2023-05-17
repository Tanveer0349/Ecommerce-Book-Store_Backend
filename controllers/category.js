const Category=require('../models/category');
const { categoryValidator } = require('../validators');

exports.create=async(req,res)=>{
    const{error}=categoryValidator(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const category=new Category(req.body);
    try{await category.save();
    res.send(category)}
    catch(err){
        res.status(501).send(err.message);
    }
};

exports.categoryById=async(req,res)=>{
    const category=await Category.findById(req.params.id);
    if(!category) return res.status(404).send('no category found');
    res.send(category)
};
exports.getCategories=async(req,res)=>{
    const result=await Category.find();
    if(!result) return res.status(404).send('no category found');
    res.send(result)
};
exports.deleteCategory=async(req,res)=>{
    const category=await Category.findByIdAndRemove(req.params.id);
    if(!category) return res.status(404).send('no category found');
    res.send(category)
};
exports.updateCategory=async(req,res)=>{
    const category=await Category.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true});
    if(!category) return res.status(404).send('no category found');
    res.send(category)
};

