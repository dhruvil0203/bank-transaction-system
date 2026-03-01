import accountModel from "../models/account.model.js";

async function createAccountController(req,res){
    
    const user = req.user;
    const account = await accountModel.create({
        userId:user._id,        
    })

    res.status(201).json({
        account,
        message:"Account created successfully",
        status:"success"
    })
}

async function getUserAccountController(req,res){
    const account = await accountModel.find({
        userId:req.user._id,
    })

    res.status(200).json({
        account,
        message:"Account fetched successfully",
        status:"success"
    })
}

async function getAccountBalanceController(req,res){
    const {accountId} = req.params;
    const account = await accountModel.findOne({
        _id:accountId,
        userId:req.user._id,
    })

    if(!account){
        return res.status(404).json({
            message:"Account not found",
            status:"failed"
        })
    }

    const balance = await account.getbalance();

    res.status(200).json({
        balance,
        message:"Account balance fetched successfully",
        status:"success"
    })
}

export default {
    createAccountController,
    getUserAccountController,
    getAccountBalanceController
}