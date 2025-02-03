import {create} from "zustand";
import { AxiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore=create((set)=>
({
    authUser:null,
    isCheckingAuth:false,
    isLoggingIn:false,
    isSigningUp:false,
    isUpdatingProfile:false,

    checkAuth: async()=>
    {
        try {
            const res=await AxiosInstance.get("/auth/check");
            set({authUser:res.data});
        } catch (error) {
            set({authUser:null});
            console.log("Problem in useAuthStore:"+error);
        }finally
        {
            set({isCheckingAuth:false})
        }
    },

    signup:async (data)=>
    {
        try {
            set({isSigningUp:true});
            const response=await AxiosInstance.post("/auth/signup",data);
            set({authUser:response.data});
            toast.success("User successfully signed up!");
        } catch (error) {
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
            console.log(response.data);
            toast.success("User logged out successfully");
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
        } catch (error) {
            set({authUser:null});
            toast.error(error.response.data.message);
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
            console.log(data);
            const response=await AxiosInstance.put("/auth/update-profile",data);
            set({authUser:response.data});
            toast.success("User profile updated");
        } catch (error) {

            console.log("Problem in updateprofile:",error);
        }
        finally
        {
            set({isUpdatingProfile:false});
        }
    }
}))