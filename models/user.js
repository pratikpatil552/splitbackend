const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    number:{
        type: String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    verified:{
        type:Boolean,
        default:false,
    }

},{timestamps:true});

const User = model("user",userSchema);
module.exports = User;