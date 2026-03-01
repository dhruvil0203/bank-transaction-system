import mongoose from "mongoose";
import ledgerModel from "./ledger.model.js";

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
        default:"Active",
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

accountSchema.methods.getbalance = async function(){
    const balancedata = await ledgerModel.aggregate([
        {
            $match:{
                account:this._id,
            }
        },
        {
            $group:{
                _id:null,
                totaldebit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","debit"]},
                            "$amount",
                            0,
                        ]
                    }
                },
                totalcredit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","credit"]},
                            "$amount",
                            0,
                        ]
                    }
                }
            }
        },
        {
            $project:{
                balance:{$subtract:["$totalcredit","$totaldebit"]}
            }
        }
    ])

    if(balancedata.length === 0){
        return 0;
    }
    return balancedata[0].balance;
}

const accountModel = mongoose.model("Account", accountSchema);
export default accountModel;