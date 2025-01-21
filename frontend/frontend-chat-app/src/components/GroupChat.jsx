import React, { useEffect, useState } from "react";
import socket from "../socket.js";

function GroupChat() {
    const [username, setUsername] = useState("");
    const [chats, setChat] = useState([]);
    const [message, setMessage] = useState("");
    const [activeClients, setActiveClients] = useState([]); 

    useEffect(() => {
        setUsername(sessionStorage.getItem("Client-username"));
        const savedChats = sessionStorage.getItem("messages");
        if (savedChats) {
            setChat(JSON.parse(savedChats));
        }

        const activeUsers=sessionStorage.getItem("Client-list");
        if(activeUsers)
        {
            setActiveClients(JSON.parse(activeUsers));
        }

        // Listen for new messages and other socket events
        socket.on("new-message", (data) => {
            setChat((prevChats) => {
                const updatedChats = [...prevChats, {
                    username:data.username,
                    status:null,
                    message:data.message

                }];
                sessionStorage.setItem("messages", JSON.stringify(updatedChats));
                return updatedChats;
            });
        });

        socket.on("user-joined", (data) => {
            setChat((prev) => {
                const updatedChats = [...prev,{
                    username:data,
                    status:"user-joined",
                    message:null
                }];
                sessionStorage.setItem("messages", JSON.stringify(updatedChats));
                return updatedChats;
            });
        });

        socket.on("user-exited", (data) => {
            setChat((prev) => {
                const updatedChats = [...prev, {
                    username:data,
                    status:"user-exited"
                }];
                sessionStorage.setItem("messages", JSON.stringify(updatedChats));
                return updatedChats;
            });
        });

        socket.on("active-user-list", (userList) => {
            setActiveClients(userList); // Update the activeClients state
            sessionStorage.setItem("Client-list", JSON.stringify(userList));
            return activeClients // Update sessionStorage
        });

        return () => {
            socket.off("new-message");
            socket.off("user-joined");
            socket.off("user-exited");
            socket.off("active-user-list");
        };
    }, []);

    const handleSendMessage = () => {
        if (username && message.trim()) {
            socket.emit("new-message", { username, message });
            setChat((prevChats) => {
                const updatedChats = [...prevChats, {
                    username:"you",
                    message:message
                }];
                sessionStorage.setItem("messages", JSON.stringify(updatedChats));
                return updatedChats;
            });
            setMessage("");
        }
    };

    return (
        <div className="group-chat">
            <div className="left-section">
                <h2 id="username">Hi, {username}</h2>
                <h3>Active clients:</h3>
                <ul>
                    {activeClients.map((value, index) => (
                        <li key={index}>{value}</li> // Render each active client properly
                    ))}
                </ul>
            </div>
            <div className="right-section">
                <ul>
                    {/* Display the chat messages */}
                    {chats.map((chat, index) =>{
                        const chatObject=chat;
                        if(chatObject?.status==="user-joined" )
                        {
                            return (<li key={index} className="status-message">{chatObject.username} joined</li>)
                        }
                        else if(chatObject?.status==="user-exited")
                        {
                            return (<li key={index} className="status-message">{chatObject.username} exited</li>)
                        }
                        else
                        {
                            return (<li key={index} className="message">{chatObject.username}:{chatObject.message}</li>)
                        }
                    })}
                </ul>
                <div className="right-bottom-section">
                    <label>Enter your message:</label>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e)=>
                        {
                            if(e.key==="Enter")
                            {
                                handleSendMessage();
                            }
                        }
                        }
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default GroupChat;
