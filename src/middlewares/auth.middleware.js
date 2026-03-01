import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import blacklistModel from "../models/blacklist.model.js";

async function authmiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"Unauthorized",
            status:"failed"
        })
    }

    const isTokenBlacklisted = await blacklistModel.findOne({token});
    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"Unauthorized access, token is blacklisted",
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

async function authsystemUserMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"Unauthorized",
            status:"failed"
        })
    }

    const isTokenBlacklisted = await blacklistModel.findOne({token});
    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"Unauthorized access, token is blacklisted",
            status:"failed"
        })
    }
    try {
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decodedToken.userId).select("+systemUser");
        
        if(!user.systemUser){
            return res.status(403).json({
                message:"Forbidden access, you are not a system user",
                status:"failed"
            })
        }
        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({
            message:"Unauthorized access, token is invalid or expired",
            status:"failed"
        })
    }  
}


export { authmiddleware, authsystemUserMiddleware };