const {Schema, model} = require("mongoose");
const jwt = require("jsonwebtoken");

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
    email:{
        type:String,
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

// dot env 
const jwtsecret = "andyp3"

userSchema.methods.generateToken = async function (){
    try{
        return jwt.sign({
            userId : this._id.toString(),
            number : this.number,
            email : this.email,
            },
            jwtsecret,
            {
                expiresIn:"30d",
            }
        )
    }
    catch(error){
        console.log(error);
    }
}


const User = model("user",userSchema);
module.exports = User;