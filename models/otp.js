const {Schema, model} = require("mongoose");

const otpSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    otp:{
        type: String,
        required:true,
    },
},{timestamps:true});


const Otp = model("otp",otpSchema);
module.exports = Otp;