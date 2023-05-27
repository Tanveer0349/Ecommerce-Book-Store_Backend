const User = require("../models/user");
const {Order} = require("../models/order");


exports.userById = async function (req, res, next, id) {
  const user = await User.findById(id).select("-password");
  if (!user) return res.status(404).send("User not found");
  req.profile = user;
  next();
};

exports.read = async(req, res) => {
  try{
const user=await User.findById({_id:req.params.userId});
res.send(user)
  }
  catch(err){
   res.status(404).send('User not found')
  }
};

exports.update = async (req, res) => {
  console.log('paramId',req.params.userId)
  let user = await User.findByIdAndUpdate(
    req.params.userId,
    { $set: req.body },
    { new: true }
  ).select("-password");
  if (!user) return res.status(404).send("user not found");
  res.send(user);
};

exports.pushOrderToHistory = async(req, res,next) => {
  let history = [];
  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      qunatity: item.count,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount,
    });
  })
 try {
   const user=await User.findByIdAndUpdate({_id:req.user._id},{history:history},{new:true});
   next()
}catch(err){
   console.log(err)
   res.send('purchase history could not be pushed!')
}
};

exports.purchaseHistory= async(req, res) => {
  try{
const orders=await Order.find({user:req.params.userId}).populate('user','_id name').sort('-createdAt')
res.send(orders)
  }
  catch(err){
    console.log(err)
   res.send('No product Purchased')
  }
};