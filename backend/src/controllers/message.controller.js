import cloudinary from "../lib/cloudinary.js";
import { Message } from "../models/message.model.js";
import {User} from "../models/user.model.js";

export const getUsersForSideBar=async (req,res)=>
{
    try {
        const loggedInUserId=req.user._id;
        const users=await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        return res.status(200).json(users);
    } catch (error) {
        console.log("Problem in getUsersForSideBar controller:"+error);
        return res.status(500).json({message:"Internal server error"});
    }

}

export const getMessages=async (req,res)=>{
    try {
        const myId=req.user._id;
        const {id:userToChatId}=req.params;
        const messages=await Message.find(
            {
                $or:
                [
                    {
                        SenderId:myId,
                        receiverId:userToChatId
                    },
                    {
                        SenderId:userToChatId,
                        receiverId:myId
                    }
                ],
            }
        );
        return res.status(200).json(messages);
    } catch (error) {
        console.log("Problem in getMessages controller:"+error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const sendMessage=async (req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        let imageUrl;
        if(image)
        {
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=new Message(
            {
                SenderId:req.user._id,
                receiverId:receiverId,
                text:text,
                image:imageUrl
            }
        );
        await newMessage.save();
        return res.status(201).json(newMessage);
    } catch (error) {
        console.log("Problem in sendMessage controller:"+error);
        return res.status(500).json({message:"Internal server error"});
    }
}