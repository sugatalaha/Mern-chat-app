import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute=async (req,res,next)=>
{
    try {
        const token=req.cookies.jwt;
        if(!token)
        {
            console.log(token);
            return res.status(401).json({message:"Unauthorized user-no token"});
        }
        const decoded=jwt.verify(token,process.env.SECRET);
        if(!decoded)
        {
            return res.status(401).json({message:"Unauthorized user-invalid token"});
        }
        const user=await User.findById(decoded.userId).select("-password");
        if(!user)
        {
            return res.status(404).json({message:"User not found!"});
        }
        req.user=user;
        next();
    } catch (error) {
        console.log("Protect route problem:"+error);
        return res.status(500).json({message:"Internal server error"}); 
    }
}