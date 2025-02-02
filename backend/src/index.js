import express from "express";
import authRoutes from "./routes/auth.route.js";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import messageRoutes from "./routes/message.route.js";
dotenv.config();

const PORT=process.env.PORT;

const app=express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

app.listen(PORT,()=>
{
    console.log("Server is listening at PORT:"+PORT);
    connectDB();
})
