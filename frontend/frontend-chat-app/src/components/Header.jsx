import React from "react";
import Logout from "./Logout"

function Header()
{
    return (
            <div className="header">
            <h1 >Welcome to InstaChat</h1>
            <Logout/>
            </div>
    )
}

export default Header;