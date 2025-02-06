import express from "express";
import authRoutes from "./routes/auth.route.js";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { server,app } from "./lib/socket.js";
import path from "path";
dotenv.config();

const PORT=process.env.PORT;


app.use(express.json({ limit: "5mb" }));  // Increase limit to 5MB
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());
app.use(cors(
    {
        origin:["http://localhost:5173",
        "http://localhost:5174"],
        credentials:true
    }
))

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

const __dirname=path.resolve();
if(process.env.NODE_ENV==="production")
{
    app.use(express.static(path.join(__dirname,"../frontend-chat-app/dist")));
    app.get("*",(req,res)=>
    {
        res.sendFile(path.join(__dirname,"../frontend-chat-app","dist","index.html"));
    })
}


server.listen(PORT,()=>
{
    console.log("Server is listening at PORT:"+PORT);
    connectDB();
})
