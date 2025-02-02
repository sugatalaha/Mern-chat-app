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
            required:true
        },
        text:{
            type:String
        },
        image:
        {
            type:String,
        }
    },
    {
        timestamps:true
    }
)

export const Message=mongoose.model("Message",MessageSchema);