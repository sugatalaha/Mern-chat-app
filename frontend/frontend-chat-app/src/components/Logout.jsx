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
            const username=sessionStorage.getItem("Client-username");
            if(username===null)
            {
                alert("You have not logged in!");
            }
            else
            {
                socket.emit("disconnect-user",username);
                sessionStorage.removeItem("Client-username");
                sessionStorage.removeItem("messages");
                sessionStorage.removeItem("Client-list");
                navigate("/",{replace:true});
            }

        }
        }>Logout</button>
    )
}

export default Logout;