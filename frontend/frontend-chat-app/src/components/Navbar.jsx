import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  return (
    <nav className="bg-purple-600 text-white py-3 px-6 flex justify-between items-center shadow-md">
      {/* Left Section */}
      <div className="text-lg font-semibold">Navbar</div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Settings Button */}
        <Link className="hover:text-gray-300 p-2 rounded-md" to="/settings">
          <FaCog size={20} />
        </Link>
        <Link className="hover:text-gray-300 p-2 rounded-md flex items-center space-x-2" to="/profile">
        <FaUserCircle size={24} />
        <span className="text-sm">{authUser?.fullname || "User"}</span></Link>


        {/* Logout Button */
        authUser?(
            <button 
            onClick={logout} 
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center space-x-1"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        ):""}

      </div>
    </nav>
  );
};
