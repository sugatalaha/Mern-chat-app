import React, { useEffect } from "react";
import { useMessageStore } from "../store/useMessageStore.js";
import { ChatComponent } from "./ChatComponent.jsx";
import { useAuthStore } from "../store/useAuthStore.js";

export const Sidebar = () => {
    const { users, isUsersLoading, getUsers, setSelectedUser, selectedUser } = useMessageStore();
    const { onlineUsers, setOnlineUsers, socket,getOnlineUsers,checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
        getUsers();
        getOnlineUsers();

        return () => {
            socket.off("getOnlineUsers"); // Clean up listener
        };
    }, [getUsers, setOnlineUsers,getOnlineUsers]);

    if (isUsersLoading) {
        return (
            <div className="w-64 h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-600">Loading...</span>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 h-screen bg-white border-r shadow-md overflow-y-auto">
                <h2 className="text-lg font-semibold p-4 border-b bg-gray-200 text-gray-700">Chats</h2>
                <div className="p-2">
                    {users.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                                selectedUser?._id === user._id ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                            }`}
                        >
                            <div className="relative w-10 h-10">
                                <img
                                    src={user.profilePic || "/default-profile.jpg"}
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full border border-gray-300"
                                />
                                {/* Online status indicator */}
                                <span
                                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                        onlineUsers.includes(user._id) ? "bg-green-500" : "bg-gray-400"
                                    }`}
                                ></span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{user.fullname}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Chat Window */}
            <div className="flex-1 h-screen bg-gray-50 flex justify-center items-center">
                {selectedUser ? (
                    <ChatComponent />
                ) : (
                    <p className="text-gray-600 text-lg">Select a user to start chatting</p>
                )}
            </div>
        </div>
    );
};
