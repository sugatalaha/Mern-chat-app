import {create} from "zustand";
import { AxiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useMessageStore=create((set,get)=>
(
    {
        messages:[],
        users:[],
        selectedUser:null,
        isUsersLoading:false,
        isMessagesLoading:false,
        getUsers:async ()=>
        {
            set({isUsersLoading:true});
            try {
                const response=await AxiosInstance.get("/message/users");
                set({users:response.data});

            } catch (error) {
                toast.error(error.response.data.message);
            }finally
            {
                set({isUsersLoading:false});
            }
        },
        getMessages:async (userId)=>
        {
            set({isMessagesLoading:true});
            try {
                const response=await AxiosInstance.get(`/message/${userId}`);
                set({messages:response.data});
            } catch (error) {
                toast.error(error.response.data.message);
            }
            finally{
                set({isMessagesLoading:false});
            }
        },
        setSelectedUser:(selectedUser)=>
        {
            set({selectedUser:selectedUser});
        },
        sendMessage:async (messageData)=>
        {
            try
            {
                const {messages,selectedUser}=get();
                const response=await AxiosInstance.post(`/message/send/${selectedUser._id}`,{text:messageData});
                set({messages:[...messages,response.data]});
            }catch(error)
            {
                toast.error(error.response.data.message);
            }
        }
    }
));
