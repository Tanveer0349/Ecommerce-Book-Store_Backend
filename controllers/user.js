const User=require('../models/user');
exports.userById=async function(req,res,next,id){
   const user=await User.findById(id).select('-password');
   if(!user) return res.status(404).send('User not found');
   req.profile=user;
   next();
};

exports.read = (req, res) => {
   return res.json(req.profile);
};

exports.update = async(req, res) => {
   let user=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true}).select('-password');
   if(!user) return res.status(404).send('user not found');
   res.send(user);
};