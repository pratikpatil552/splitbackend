const express = require('express');
const router = express.router();
const User = require('../models/user');
const Otp =  require('../models/otp');


async function mailer(recieveremail, code) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        requireTLS: true,
        auth: {
            user : "pratikpatil",
            pass : "ipvppibscwkrotjo"
        }
    })

    let info =  await transporter.sendMail({
        from : "split Backend",
        to : recieveremail,
        subject: "OTP for verification",
        text: "Your OTP is " + code,
        html: "<b>Your OTP is " + code + "</b>",
    })

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}

router.post('/sendotp', async (req,res,next)=>{

    const {email} = req.body;

    if (!email){
        res.status(400).json({
            message: "Please Provide a email",
            data: null,
            ok: false,
        }); 
    }

    try{

        await Otp.deleteOne({email : email}); // deleted previosuly existing entry 

        const otpcode = Math.floor(100000 + Math.random()*900000);
        
        await mailer(email,otpcode);

        const newVerification = new Otp({
            email: email,
            code: otpcode,
        });

        await newVerification.save();

        console.log("New Verify Entry Created " , newVerification);

        res.status(200).json({
            message: "Otp Created Successfully",
            data: null,
            ok: true,
        }); 


    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "Something Went wrong",
            data: null,
            ok: false,
        }); 
        
    }
});

router.post('/signup',async (req,res)=>{

    try{
        const {name,number,email,password,otp} = req.body;

        const user = await User.findOne({number : number});
        
        const otpentry = await Otp.findOne({email : email});

        if (!user){
            // console.log("user already existed !");

            res.status(400).json({
                message: "User Already Existed",
                data: null,
                ok: false,
            }); 
        }
        if (!otpentry){
            // console.log("Otp entry not present");

            res.status(400).json({
                message: "Otp entry not present",
                data: null,
                ok: false,
            }); 
        }

        if (otp != otpentry.code){
            // console.log("otp not matched !");
            res.status(400).json({
                message: "otp not matched ",
                data: null,
                ok: false,
            }); 
            
        }
        
        const NewUser = new User({
            name : name,
            email : email,
            number : number,
            password : password,
        });

        await NewUser.save();

        await Otp.deleteOne({email : email});

        // return final reponse 
        res.status(200).json({
            message: "user registered Successfully",
            data: null,
            ok: true,
        }); 


    }
    catch(error){
        res.status(500).json({
            message: "An Error occured",
            data: null,
            ok: false,
        }); 
    }

})
