import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup=async (req,res)=>
{
    try
    {
        const {fullname,email,password}=req.body;
        if(!fullname || !email || !password)
        {
            return res.status(400).json({message:"All fields must be filled!"});
        }
        if(password?.length<6)
        {
            return res.status(400).json({message:"Password length must be atleast 6"});
        }
        const user=await User.findOne(
            {
                email:email
            }
        )
        if(user)
        {
            return res.status(400).json({message:"User email already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User(
            {
                email:email,
                password:hashedPassword,
                fullname:fullname
            }
        );
        if(newUser)
        {
            generateToken(newUser._id,res);
            await newUser.save();
            return res.status(200).json(
                {
                    user:
                    {
                        email:newUser.email,
                        fullname:newUser.fullname,
                        profilePic:newUser.profilePic
                    }
                }
            )
        }
        else{
            return res.status(400).json({message:"Invalid user data"});
        }
    }
    catch(error)
    {
        console.log("Problem in signup route"+error);
        return res.status(500).json("Internal server error");

    }
}

export const login=async (req,res)=>
{
    try {
        const {email,password}=req.body;
        if(!email || !password)
        {
            return res.status(400).json({message:"All fields must be filled"});
        }
        const user=await User.findOne(
            {
                email:email
            }
        )
        if(user)
        {
            const isPasswordCorrect=await bcrypt.compare(password,user.password);
            if(!isPasswordCorrect)
            {
                return res.status(400).json({message:"Incorrect password"});
            }
            generateToken(user._id,res);
            return res.status(200).json(
                {
                    fullname:user.fullname,
                    email:user.email,
                    profilePic:user.profilePic
                }
            );
        }
        else
        {
            return res.status(400).json("User not logged in!");
        }
        
    } catch (error) {
        console.log("Problem in login route"+error);
        return res.status(500).json("Internal server error");
    }
}

export const logout=async (req,res)=>
{
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            expires: new Date(0)  // This removes the cookie
          });
        return res.status(200).json({message:"Logout successful!"});
    } catch (error) {
        console.log("Problem in logout route"+error);
        return res.status(500).json("Internal server error");
    }
}

export const updateProfile= async (req,res)=>
{
    const {profilePic}=req.body;
    const userId=req.user._id;
    if(!profilePic)
    {
        return res.status(401).json({message:"Profile pic cannot be empty"});
    }
    const uploadResponse=cloudinary.uploader.upload(profilePic);
    const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:(await uploadResponse).secure_url},{new:true}).select("-password");
    return res.status(200).json(updatedUser);
}

export const checkAuth=async (req,res)=>
{
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Problem in checkAuth controller:"+error);
        return res.status(500).json({message:"Internal server error"});
    }
}