import mongoose from "mongoose";

const MessageSchema=new mongoose.Schema(
    {
        SenderId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        receiverId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        text:{
            type:String
        },
        image:
        {
            type:String,
        },
        isGroupMessage:
        {
            type:Boolean,
        }
    },
    {
        timestamps:true
    }
)

export const Message=mongoose.model("Message",MessageSchema);