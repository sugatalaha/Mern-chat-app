import React from "react";
import socket from "../socket.js";
import { replace, useNavigate } from "react-router-dom";
function Logout()
{
    const navigate=useNavigate();
    return(
        <button onClick={(event)=>
        {
            event.preventDefault();
            const username=localStorage.getItem("Client-username");
            if(username===null)
            {
                console.log(username);
                alert("You have not logged in!");
            }
            else
            {
                socket.emit("disconnect-user",username)
                console.log("Client has logged out successfully");
                localStorage.removeItem("Client-username");
                localStorage.removeItem("messages");
                localStorage.removeItem("Client-list");
                navigate("/",{replace:true});
            }

        }
        }>Logout</button>
    )
}

export default Logout;