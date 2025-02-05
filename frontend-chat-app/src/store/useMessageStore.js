import { create } from "zustand";
import { AxiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useMessageStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isGroupMessagesLoading:false,
    groupUsers:[],
    groupMessages:[],
    groupChatSelected:false,

    // Fetch Users
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const response = await AxiosInstance.get("/message/users");
            set({ users: response.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    // Fetch Messages for a selected user
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await AxiosInstance.get(`/message/${userId}`);
            set({ messages: response.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    // Set selected user
    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },

    // Send message
    sendMessage: async (messageData) => {
        const { messages, selectedUser } = get();
        if (!selectedUser) {
            toast.error("No user selected!");
            return;
        }

        try {
            const response = await AxiosInstance.post(`/message/send/${selectedUser._id}`, { text: messageData });
            set((state) => ({ messages: [...state.messages, response.data] }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    // Subscribe to new messages via WebSocket
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        
        // Prevent duplicate listeners
        if (!socket.hasListeners("NewMessage")) {
            socket.on("NewMessage", (newMessage) => {
                set((state) => ({ messages: [...state.messages, newMessage] }));
            });

            // Re-subscribe on reconnection
            socket.on("connect", () => {
                get().subscribeToMessages();
            });
        }
    },

    // Unsubscribe from messages when not needed
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("NewMessage");
        }
    },
    subscribeToGroup:()=>
    {
        const socket=useAuthStore.getState().socket;
        if (!socket.hasListeners("GroupMessage")) {
            socket.on("GroupMessage", (GroupMessage) => {
                set((state) => ({ groupMessages: [...state.groupMessages, GroupMessage] }));
            });

            // Re-subscribe on reconnection
            socket.on("connect", () => {
                get().subscribeToMessages();
            });
        }
    },
    unsubscribeFromGroup: ()=>
    {
        set({groupChatSelected:false});
        const {socket,authUser}=useAuthStore.getState();
        socket.emit("exit-groupchat",authUser);
        socket.off("GroupMessage");
    },

    sendGroupMessage: async (text)=>
    {
        try {
            const response=await AxiosInstance.post("/message/send/groupchat",{text:text});
            
        } catch (error) {
            console.log("Problem in sendGroupMessage function:",error);
        }
    },

    getGroupMessages:async ()=>
    {
        try {
            set({groupChatSelected:true});
            set({isGroupMessagesLoading:true});
            const response=await AxiosInstance.get("/message/groupchat");
            set({groupMessages:response?.data});
        } catch (error) {
            console.log("Problem in getGroupMessage function:",error);
        }
        finally
        {
            set({isGroupMessagesLoading:false});
        }
    },

    getGroupUsers: ()=>
    {
        const {socket}=useAuthStore.getState();
        if(socket)
        {
            socket.on("getGroupChatUsers",(data)=>
            {
                set({groupUsers:data});
            })
        }
    }
}));