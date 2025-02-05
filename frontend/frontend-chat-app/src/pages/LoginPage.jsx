import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"; // Import icons
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
   const {login,isLoggingIn}=useAuthStore();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const success=validateForm();
    if(success)
    {
        login({email:email,password:password});
    }
    
};

const validateForm=()=>
{
    if(!email.trim())return toast.error("Email required");
    else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))return toast.error("Invalid email");
    else if(!password?.trim())return toast.error("Password required");
    else if(password.trim().length<6)return toast.error("Password length must be atleast 6");
    return true;
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative mt-2">
            <FiMail className="absolute left-3 top-3 text-gray-500" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative mt-2">
            <FiLock className="absolute left-3 top-3 text-gray-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="text-center">
        {
            !isLoggingIn?
            (
                <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={handleLogin}
              >
                Login
              </button>
            ):
            <div className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Loading...</div>
        }
        </div>
        <div>
          Don't have an account?Click for <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};
