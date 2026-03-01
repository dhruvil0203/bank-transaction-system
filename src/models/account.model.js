import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index:true
    },
    status: {
        type:String,
        enum: ["Active", "Frozen","Closed"],
        message:"Status can be either Active, Frozen or Closed",
        defualt:"Active",
    },
    currency:{
        type:String,
        required:[true,'Currency is required for account creation'],
        default:"INR",
    }
},{
    timestamps:true
});

accountSchema.index({userId:1,status:1})

const accountModel = mongoose.model("Account", accountSchema);
export default accountModel;