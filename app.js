const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8000;

// server started here
const app = express();


// connected to mongodb now for mongosh
mongoose
    .connect("mongodb://127.0.0.1:27017/split")
    .then((e)=>{console.log("mongo db connected")});

// middlewares used here
app.use(express.urlencoded())

// it is the test route
app.get("/test",(req,res)=>{
    res.json({status:"success"});
})

app.post("/user/signup",(req,res)=>{
    console.log(req.body);
    res.json({status:"success"});
    console.log("Gaurav");
    res.send("success");
})


app.listen(PORT,()=>{console.log("server started successfully")});