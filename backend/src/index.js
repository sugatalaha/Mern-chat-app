import express from "express";
import authRoutes from "./routes/auth.route.js";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
dotenv.config();

const PORT=process.env.PORT;

const app=express();

app.use(express.json({ limit: "5mb" }));  // Increase limit to 5MB
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true
    }
))

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

app.listen(PORT,()=>
{
    console.log("Server is listening at PORT:"+PORT);
    connectDB();
})
