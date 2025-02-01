 import express from "express";
 import {signup,login,logout, updateProfile} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protect-route.middleware.js";

 const router=express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

router.put("update-profile",protectRoute,updateProfile)

 export default router;