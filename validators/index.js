const Joi=require('joi');


const userSchema=Joi.object({
    name:Joi.string().min(3).max(32).required(),
    password:Joi.string().min(3).required(),
    email:Joi.string().email().min(3).max(32).required()
});
function userSignUpValidator(user){
    return userSchema.validate(user);
};

const categorySchema=Joi.object({
    name:Joi.string().min(2).max(32).required(),
});
function categoryValidator(obj){
    return categorySchema.validate(obj);
};



module.exports.userSignUpValidator=userSignUpValidator;
module.exports.categoryValidator=categoryValidator;
