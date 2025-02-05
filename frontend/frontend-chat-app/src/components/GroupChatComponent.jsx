import { useMessageStore } from "../store/useMessageStore.js";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FiLogOut } from "react-icons/fi";

export const GroupChatComponent = () => {
    const { 
        isGetGroupMessagesLoading, 
        groupMessages, 
        sendGroupMessage,
        subscribeToGroup,
        unsubscribeFromGroup,
        getGroupMessages 
    } = useMessageStore();

    const [newMessage, setNewMessage] = useState(""); 
    const chatEndRef = useRef(null);
    const navigate = useNavigate();  

    // Fetch messages & users on mount
    useEffect(() => {
        getGroupMessages();
        const groupChatSelected = useMessageStore.getState().groupChatSelected;
        if (groupChatSelected) {
            subscribeToGroup();
            return () => unsubscribeFromGroup();
        }
    }, [subscribeToGroup]);

    // Scroll to latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [groupMessages]);

    // Handle sending messages
    const handleSendMessage = async () => {
        if (newMessage.trim() !== "") {
            await sendGroupMessage(newMessage);
            setNewMessage(""); 
        }
    };

    // Handle exit button
    const handleExit = () => {
        unsubscribeFromGroup();
        navigate("/");
    };

    return (
        <div className="flex-1 h-screen flex flex-col bg-black text-white">
            {/* Header */}
            <div className="bg-gray-900 p-4 text-lg font-semibold flex justify-between items-center shadow-lg">
                <span>🚀 Group Chat</span>
                <button 
                    onClick={handleExit} 
                    className="bg-red-600 px-3 py-1 rounded-lg flex items-center hover:bg-red-700 transition"
                >
                    Exit <FiLogOut className="ml-2" />
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
                {isGetGroupMessagesLoading ? (
                    <p className="text-gray-400 text-center">Loading messages...</p>
                ) : (
                    groupMessages.map((msg, index) => (
                        <div key={index} className="flex items-start space-x-3 bg-gray-700 p-3 rounded-lg shadow-md max-w-md mx-auto">
                            <img 
                                src={msg?.SenderId?.profilePic || "/default-profile.jpg"}  
                                alt="Profile"
                                className="w-10 h-10 rounded-full border-2 border-blue-500"
                            />
                            <div>
                                <p className="text-blue-400 font-semibold">{msg?.SenderId?.fullname}</p>
                                <p className="bg-gray-600 p-3 rounded-lg text-sm mt-1">{msg.text}</p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={chatEndRef}></div>
            </div>

            {/* Message Input */}
            <div className="bg-gray-900 p-4 flex items-center border-t border-gray-700 shadow-md">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 rounded-lg bg-gray-700 text-white outline-none placeholder-gray-400"
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-3 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Send 🚀
                </button>
            </div>
        </div>
    );
};
