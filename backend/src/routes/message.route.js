import express from "express";
import { protectRoute } from "../middleware/protect-route.middleware.js";
import { getGroupMessages, getMessages,getUsersForSideBar, sendGroupMessage, sendMessage } from "../controllers/message.controller.js";

const router=express.Router();

router.get("/users", protectRoute, getUsersForSideBar);
router.get("/groupchat", protectRoute, getGroupMessages); // Place this before the dynamic :id route
router.post("/send/groupchat", protectRoute, sendGroupMessage);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);


export default router;