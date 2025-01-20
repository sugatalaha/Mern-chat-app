import socket from "../socket.js";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUserName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (username?.trim() === "") {
            alert("Username field can't be empty!");
        } else {
            sessionStorage.setItem("Client-username", username);

            // Emit the new-user-joined event
            socket.emit("new-user-joined", username);

            // Listen for an error event
            socket.once("error", (data) => {
                alert(data.message); // Show the error message
                sessionStorage.removeItem("Client-username"); // Clear username if invalid
            });

            // Listen for success (implicit success if no error is received within a short time)
            socket.once("active-user-list", (userList) => {
                sessionStorage.setItem("Client-list",JSON.stringify(userList));
                navigate("/groupchat"); // Redirect to the group chat
            });
        }
    };

    return (
        <div>
            Enter your username:
            <input
                type="text"
                name="usernameBox"
                id="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button id="onSubmit" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    );
}

export default Login;
