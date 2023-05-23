const User = require("../models/user");
exports.userById = async function (req, res, next, id) {
  const user = await User.findById(id).select("-password");
  if (!user) return res.status(404).send("User not found");
  req.profile = user;
  next();
};

exports.read = (req, res) => {
  return res.json(req.profile);
};

exports.update = async (req, res) => {
  let user = await User.findByIdAndUpdate(
    req.params.id,
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
