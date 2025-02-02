 import express from "express";
 import {signup,login,logout, updateProfile, checkAuth} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protect-route.middleware.js";

 const router=express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",protectRoute,logout)
router.put("/update-profile",protectRoute,updateProfile);
router.get("/check",protectRoute,checkAuth);

 export default router;