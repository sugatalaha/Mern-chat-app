import React, { useEffect, useState, useRef } from "react";
import { useMessageStore } from "../store/useMessageStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { IoSend } from "react-icons/io5";
import { MdAttachFile } from "react-icons/md";

export const ChatComponent = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser, sendMessage, subscribeToMessages, unsubscribeFromMessages, isSending } = useMessageStore();
    const [newMessage, setNewMessage] = useState("");
    const { authUser } = useAuthStore.getState();
    const [preview,setPreview]=useState("");
    const [base64Image,setBase64Image]=useState("");
    const messagesEndRef = useRef(null);

    const handleFileSend=async (e)=>
    {
        const file=e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreview(reader.result);
              setBase64Image(reader.result); // Set base64 only after reader finishes
            };
            reader.readAsDataURL(file);
          }
    }
    
    // Fetch messages when selectedUser changes
    useEffect(() => {
        if (selectedUser) {
            setPreview("");
            setNewMessage("");
            setBase64Image("");
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
        if (newMessage.trim() === "" && base64Image==="") return;
        sendMessage({text:newMessage,image:base64Image});
        setNewMessage(""); // Clear input after sending
        setPreview("");
        setBase64Image("");
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
        <div className="flex flex-col h-screen w-full bg-gray-100">
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
                    <div key={index} className={`flex ${msg.senderId === authUser._id ? "justify-end" : "justify-start"}`}>
                        <div className={`p-3 rounded-lg max-w-xs text-sm ${msg.senderId === authUser._id ? "bg-blue-500 text-white" : "bg-white border shadow-sm"}`}>
                            {msg.image && <img src={msg.image}/>}
                            {msg.text && <p>{msg.text}</p>}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Message Input Box */}
            <div className="p-4 border-t bg-white flex items-center gap-3">
                    {preview && (
                        <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                    )}
                <button className="text-gray-500 hover:text-gray-700 relative">
                    <MdAttachFile size={24} />
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileSend} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                </button>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg outline-none"
                    onKeyDown={(e)=>
                    {
                        if(e.key==="Enter")
                        {
                            handleSendMessage();
                        }
                    }
                    }
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                >
                    <IoSend size={20} aria-disabled={isSending} />
                </button>
            </div>
        </div>
    );
};