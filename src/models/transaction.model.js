import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Transaction must be associated from an account"],
        index:true,
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Transaction must be associated to an account"],
        index:true,
    },
    status:{
        type:String,
        enum:["pending","success","failed","reversed"],
        message:"Status can be either pending,completed,failed or reversed",
        default:"pending"
    },
    amount:{
        type:Number,
        required:[true,"Amount is required"],
    },
    idempotencyKey:{
        type:String,
        required:[true,"Item potency key is required for creating a transaction"],
        unique:true,
        index:true,
    }
},
{
    timestamps:true,
})

const transactionModel = mongoose.model("Transaction",transactionSchema);

export default transactionModel;