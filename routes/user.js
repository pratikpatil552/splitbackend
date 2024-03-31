const {Router, application} = require("express");
const User = require("../models/user");
const Otp = require("../models/otp");
var nodemailer = require('nodemailer');

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
        console.log("Email sent successfully");
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
    const otpdoc = await Otp.findOne({email});
    if(otpdoc){
        if(otpdoc.otp === otp){
            try{
                const userdoc = await User.create({
                    name,
                    number,
                    email,
                    password,
                    verified:true,
                })
                return res.json({status:"successfull registeration"});
            }
            catch(error){
                return res.json({status:"email or mobile number is already used"});
            }

        }
        else return res.json({status:"type the correct otp"});
    }
    else return res.json({status:"generate the otp first",error:"no otp is generated"});
})

module.exports = router;

// twilo recovery code EVAKHMHX5WNVZLEC4B7BNNLN