const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userSignUpValidator } = require("../validators");
const jwt=require('jsonwebtoken');
require('dotenv').config();


module.exports.signup = async (req, res) => {
  const { error } = userSignUpValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let userInDb = await User.findOne({ email: req.body.email });
  if (userInDb) return res.status(400).send("User already registered");
  let user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.status(200).send(user);
};

module.exports.signin = async (req, res) => {
  let userInDb = await User.findOne({ email: req.body.email });
  if (!userInDb)
    return res.status(400).send("user is not registered. Please signup");
  const valid = await bcrypt.compare(req.body.password, userInDb.password);
  if (!valid) return res.status(401).send("invalid email or password");
  const token = userInDb.genAuthToken();
  userInDb.password=undefined;
  userInDb.token=token;
  res.status(200).send(userInDb);
};

module.exports.requireSignin = function requireSignin(req, res, next) {
  const token = req.headers.token;
  if (!token) return res.status(401).send("Access denied. no token provided");

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user=decoded;
  } catch (ex) {
    res.status(400).send("Invalid Token");
  }
  next();
};

module.exports.isAdmin=function(req,res,next){
  if(!req.user.role==1) return res.status(403).send('Admin resource! You are not authorized');
  next();
}

