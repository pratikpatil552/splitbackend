const {Schema, model} = require("mongoose");

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
    status:{
        type: Boolean,
        default :false,
    },
}, { timestamps: true });

const resultSchema = new Schema({
    group:{
        type: Schema.Types.ObjectId,
        ref:"group",
        required:true,
    },
    optimaltransactions :[transactionSchema],

},{timestamps:true});


const Result = model("result",resultSchema);
module.exports = Result;