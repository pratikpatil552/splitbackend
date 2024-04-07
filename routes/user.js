const {Router, application} = require("express");
const User = require("../models/user");
const Otp = require("../models/otp");
var nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const router = new Router();

const genOtp = ()=>{
    let digits = '0123456789'; 
    let OTP = ''; 
    let len = digits.length 
    for (let i = 0; i < 6; i++) { 
        OTP += digits[Math.floor(Math.random() * len)]; 
    } 
    return OTP; 
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pratikpatilmudalp3@gmail.com',
      pass: 'ytestgpiwyslbpxv'
    }
});



// this function is working properly done and dusted
router.post("/signup/otp",async (req,res)=>{
    const {email} = req.body;
    const currOtp = genOtp();
    var mailOptions = {
        from: 'pratikpatilmudalp3@gmail.com',
        to: `${email}`,
        subject: `Verify you email`,
        text: `your otp is ${currOtp}`
    };

    try{
        const otpdoc = await Otp.create({
            email,
            otp:currOtp,
        });
    }
    catch(error){
        return res.json({status:"otp already sent", error:"wait for 5 minutes"});
    }

    try {
        await transporter.sendMail(mailOptions);
    } 
    catch (error) {
        await Otp.deleteOne({email});
        console.error("Error sending email:", error.message);
        return res.json({ status: "failed to send OTP", error: error.message });
    }
    return res.json({status:"otp sent successfully"});
})


router.post("/signup",async (req,res)=>{
    const {name,number,password,email,otp} = req.body;
    console.log(req.body);
    const otpdoc = await Otp.findOne({email});
    if(otpdoc){
        if(otpdoc.otp === otp){
            try{
                const saltround = 10;
                const hashPassword = await bcrypt.hash(password,saltround);
                console.log(hashPassword);
                console.log("number : ",await User.findOne({number}));
                console.log("email : ",await User.findOne({email}) )
                if(await User.findOne({number})){
                    return res.json({status:"duplicate number"});
                }
                if(await User.findOne({email})){
                    return res.json({status:"duplicate email"});
                }
                const userdoc = await User.create({
                    name,
                    number,
                    email,
                    password:hashPassword,
                    verified:true,
                })
                return res.cookie("token",await userdoc.generateToken()).json({status:"successfull registeration"});
            }
            catch(error){
                console.log(error);
                return res.json({status:"email or mobile number is already used"});
            }

        }
        else return res.json({status:"type the correct otp"});
    }
    else return res.json({status:"generate the otp first",error:"no otp is generated"});
})


// user login path
router.post("/signin",async (req,res)=>{
    try{
        const {number,password} = req.body;
        const userDoc = await User.findOne({number});
        if(!userDoc){
            return res.json({status:"invalid"});
        }
        const user = await bcrypt.compare(password,userDoc.password);
        if(user){
            return res.cookie("token",await userDoc.generateToken()).json({status:"logged in successfully",name:userDoc.name, number:userDoc.number, email:userDoc.email});
        }
        else return res.json({status:"invalid"});
    }
    catch(error){
        console.log("error");
    }
})


// router for keeping user logged in using profile route
router.get("/profile",async (req,res)=>{
    const token = req.cookies?.token;
    if(token){
        const payload = jwt.verify(token,"andyp3");
        if(!payload) return res.json({status:"no user found logged in"})
        const {name,number,email} = payload;
        return res.json({name,number,email});
    }
    else return res.json({status:"no user logged in found"});
})

module.exports = router;

// twilo recovery code EVAKHMHX5WNVZLEC4B7BNNLN