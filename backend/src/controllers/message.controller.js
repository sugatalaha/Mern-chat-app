import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { Message } from "../models/message.model.js";
import {User} from "../models/user.model.js";
import {io} from "../lib/socket.js";

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
        const retrievedMessage=await newMessage.populate("SenderId", "fullname profilePic");
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId)
        {
            io.to(receiverSocketId).emit("NewMessage",retrievedMessage);
        }
        return res.status(201).json(retrievedMessage);
    } catch (error) {
        console.log("Problem in sendMessage controller:"+error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const getGroupMessages=async (req,res)=>{
    try {
        const groupMessages = await Message.find({ isGroupMessage: true })
        .populate("SenderId", "fullname profilePic"); 
        return res.status(200).json(groupMessages);
    } catch (error) {
        console.log("Problem in getGroupMessages controller:",error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const sendGroupMessage=async (req,res)=>
{
    try {
        const {text}=req.body;
        const id=req.user._id;
        const groupMessage=new Message(
            {
                SenderId:id,
                isGroupMessage:true,
                text:text
            }
        );
        await groupMessage.save();
        const retrievedMessage=await groupMessage.populate("SenderId","fullname profilePic");
        io.emit("GroupMessage",retrievedMessage);
        return res.status(200).json(retrievedMessage);
    } catch (error) {
        console.log("Problem in sendGroupMessage controller:",error);
        return res.status(500).json({message:"Internal server error"});
    }
}
