const {Schema, model} = require("mongoose");
const jwt = require("jsonwebtoken");

const transactionSchema = new Schema({
    to: {
        type: Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    addedby: {
        type: Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
}, { timestamps: true });

const groupSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    members:[{
        type:Schema.Types.ObjectId,
        ref:"user",
    }],
    status:{
        type:String,
        default:"pending",
    },
    transactions:[transactionSchema],

},{timestamps:true});


const Group = model("group",groupSchema);
module.exports = Group;