import mongoose from "mongoose";

const blacklistSchema = mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token is required to blacklist"],
        unique:[true,"Token is already blacklisted"]
    },
},{
    timestamps:true,
})

blacklistSchema.index({createdAt:1},{expireAfterSeconds:60*60*24*7});

const blacklistModel = mongoose.model("Blacklist",blacklistSchema);

export default blacklistModel;