const { Order, CartItem } = require("../models/order");
module.exports.create = async (req, res) => {
  req.body.order.user = req.user._id;
  const order = new Order(req.body.order);
  try {
    const { data } = await order.save();
    res.send(data);
  } catch (err) {
    res.send(err);
  }
};

module.exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "_id name address");
    res.send(orders);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.listStatusValues = async (req, res) => {
  res.send(Order.schema.path("status").enumValues);
};

module.exports.updateStatus = async (req, res) => {
  const id = req.params.orderId;
  try {
    const order = await Order.findByIdAndUpdate(
      { _id: id },
      { $set: { status: req.body.status } },
      { new: true }
    );
    res.send(order);
  } catch (err) {
    res.status(400).send(err);
  }
};
