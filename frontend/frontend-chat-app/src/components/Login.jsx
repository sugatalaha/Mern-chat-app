import socket from "../socket.js";
import React ,{useState} from "react";
import { useNavigate } from "react-router-dom";

function Login()
{
    const [username,setUserName]=useState("");
    const navigate=useNavigate()
    return(
        <div>
            Enter your username:
            <input type="text" name="usernameBox" id="username" value={username} onChange={(e)=>
                {
                    setUserName(e.target.value);
                }
            }/>
            <button id="onSubmit" onClick={(event)=>
                {
                    event.preventDefault();
                    localStorage.setItem("Client-username",username);
                    socket.emit("new-user-joined",username);
                    navigate("/groupchat");
                }
            }>Submit</button>
        </div>
    )
}

export default Login;