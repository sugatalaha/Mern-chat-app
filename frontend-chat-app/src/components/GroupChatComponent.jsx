import { useMessageStore } from "../store/useMessageStore.js";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FiLogOut } from "react-icons/fi";
import { MdAttachFile } from "react-icons/md";
import { IoSend } from "react-icons/io5";

export const GroupChatComponent = () => {
    const { 
        isGetGroupMessagesLoading, 
        groupMessages, 
        sendGroupMessage,
        subscribeToGroup,
        unsubscribeFromGroup,
        getGroupMessages,
        isSending 
    } = useMessageStore();
    const [preview,setPreview]=useState("");
    const [base64Image,setBase64Image]=useState("");

    const [newMessage, setNewMessage] = useState(""); 
    const chatEndRef = useRef(null);
    const navigate = useNavigate();  

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
        if (newMessage.trim() !== "" || base64Image!="") {
            await sendGroupMessage({text:newMessage,image:base64Image});
            setNewMessage(""); 
            setPreview("");
            setBase64Image("");
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
                                {msg.image && <img src={msg.image} className="bg-gray-600 p-3 rounded-lg text-sm mt-1"/>}
                                {msg.text && <p className="bg-gray-600 p-3 rounded-lg text-sm mt-1">{msg.text}</p>}
                            </div>
                        </div>
                    ))
                )}
                <div ref={chatEndRef}></div>
            </div>

            {/* Message Input */}
            <div className="bg-gray-900 p-4 flex items-center border-t border-gray-700 shadow-md">
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
                    className="flex-1 p-2 rounded-lg bg-gray-700 text-white outline-none placeholder-gray-400"
                    placeholder="Type a message..."
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
