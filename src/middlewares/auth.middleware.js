import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import emailServices from "../services/email.services.js";

async function authmiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"Unauthorized",
            status:"failed"
        })
    }

    try {
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decodedToken.userId);
        
        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({
            message:"Unauthorized access, token is invalid or expired",
            status:"failed"
        })
    }  
}

export default authmiddleware;