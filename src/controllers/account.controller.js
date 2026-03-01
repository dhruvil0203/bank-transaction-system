import accountModel from "../models/account.model.js";
import emailService from "../services/email.services.js";

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

    await emailService.sendcreateAccountEmail(user.email,user.name);
}

export default {
    createAccountController
}