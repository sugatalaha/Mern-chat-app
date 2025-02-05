import React, { useEffect, useState, useRef } from "react";
import { useMessageStore } from "../store/useMessageStore.js";

export const ChatComponent = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser, sendMessage, subscribeToMessages, unsubscribeFromMessages } = useMessageStore();
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Fetch messages when selectedUser changes
    useEffect(() => {
        if (selectedUser) {
            subscribeToMessages();
            getMessages(selectedUser._id);
        }
        return () => {
            unsubscribeFromMessages();
        };
    }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    // Scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Send Message Handler
    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;
        sendMessage(newMessage);
        setNewMessage(""); // Clear input after sending
    };

    // If no user is selected
    if (!selectedUser) {
        return <div className="flex items-center justify-center h-full text-gray-600">Select a user to start chatting</div>;
    }

    // Show loading state for messages
    if (isMessagesLoading) {
        return <div className="flex items-center justify-center h-full text-gray-600">Loading messages...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-gray-100 w-100">
            {/* Chat Header */}
            <header className="p-4 border-b bg-white flex items-center gap-3 shadow-md">
                <img
                    src={selectedUser.profilePic || "/default-profile.jpg"}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border border-gray-300"
                />
                <h3 className="text-lg font-semibold">{selectedUser.fullname}</h3>
            </header>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.isSender ? "justify-end" : "justify-start"}`}>
                        <div className={`p-3 rounded-lg max-w-xs text-sm ${msg.isSender ? "bg-blue-500 text-white" : "bg-white border shadow-sm"}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Message Input Box */}
            <div className="p-4 border-t bg-white flex items-center gap-3">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg outline-none"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
