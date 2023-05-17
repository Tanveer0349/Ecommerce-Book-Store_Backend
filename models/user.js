const { mongoose } = require("mongoose");
const jwt=require('jsonwebtoken');
require('dotenv').config();


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    trim: true,
  },
  history: {
    type: Array,
    default: [],
  },
  role: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  }
},{timestamps:true});

userSchema.methods.genAuthToken=function(){
  return jwt.sign({_id:this._id,role:this.role},process.env.SECRET)
}

module.exports=mongoose.model('User',userSchema);
