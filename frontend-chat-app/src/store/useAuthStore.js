import {create} from "zustand";
import { AxiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
const BASE_URL="http://localhost:3000";

export const useAuthStore=create((set,get)=>
({
    authUser:null,
    isCheckingAuth:false,
    isLoggingIn:false,
    isSigningUp:false,
    isUpdatingProfile:false,
    socket:null,
    onlineUsers:[],
    setOnlineUsers: (users) => set({ onlineUsers: users }),

    checkAuth: async()=>
    {
        try {
            const res=await AxiosInstance.get("/auth/check");
            set({authUser:res.data});
            get().connectSocket();
        } catch (error) {
            set({authUser:null});
            console.log("Problem in useAuthStore:"+error);
        }finally
        {
            set({isCheckingAuth:false})
        }
    },
    getOnlineUsers:()=>
    {
        get()?.socket?.on("getOnlineUsers", (users) => {
            get().setOnlineUsers(users);
        });
    },

    signup:async (data)=>
    {
        try {
            set({isSigningUp:true});
            const response=await AxiosInstance.post("/auth/signup",data);
            set({authUser:response.data});
            toast.success("User successfully signed up!");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
            console.log("Problem in sign-up:",error);
        }finally
        {
            set({isSigningUp:false});
        }
    },
    logout:async ()=>
    {
        try {
            const response=await AxiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("User logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Something went wrong!");
            console.log("Problem in logout:",error);
        }
    },
    login:async (data)=>
    {
        try {
            set({isLoggingIn:true});
            const response=await AxiosInstance.post("/auth/login",data);
            set({authUser:response.data});
            toast.success("User logged in successfully");
            get().connectSocket();
            get().socket.on("getOnlineUsers",(currentUsers)=>
            {
                set({onlineUsers:currentUsers});
            })
        } catch (error) {
            set({authUser:null});
            toast.error(error.response.data.message || "Invalid credentials");
            console.log("Problem in login:",error);
        }finally
        {
            set({isLoggingIn:false});
        }
    },
    updateProfile:async (data)=>
    {
        try {
            set({isUpdatingProfile:true});
            const response=await AxiosInstance.put("/auth/update-profile",data);
            set({authUser:response.data});
            toast.success("User profile updated");
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
            console.log("Problem in updateprofile:",error);
        }
        finally
        {
            set({isUpdatingProfile:false});
        }
    },
    connectSocket:async ()=>
    {
        const {authUser}=get();
        if(!authUser)return;
        const socket=io(BASE_URL,{
            query:
            {
                userId:authUser._id
            }
        })
        set({socket:socket});
        
    },
    disconnectSocket:async ()=>
    {
        get()?.socket?.disconnect();
        set({socket:null});
    }
}));

