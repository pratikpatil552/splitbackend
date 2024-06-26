const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser")

const userRoute = require("./routes/user");
const groupRoute = require("./routes/group");

const PORT = process.env.PORT || 8000;

// server started here
const app = express();


// connected to mongodb now for mongosh
mongoose
    .connect("mongodb://127.0.0.1:27017/split")
    .then((e)=>{console.log("mongo db connected")});

// middlewares used here
app.use(express.json());
app.use(cors({
    credentials : true,
    origin : "http://localhost:3000",
}));

app.use(cookieParser());

// it is the test route
app.get("/test",(req,res)=>{
    res.json({status:"success"});
})

app.use("/user",userRoute);
app.use("/group",groupRoute);


app.listen(PORT,()=>{console.log("server started successfully")});