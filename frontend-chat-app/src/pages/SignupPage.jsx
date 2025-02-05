import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";


export const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ fullname: "", email: "", password: "" });
    const { signup, isSigningUp } = useAuthStore();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const success=validateForm();
        if(success)
        {
            signup(formData);
        }
        
    };

    const validateForm=()=>
    {
        if(!formData.fullname?.trim())return toast.error("Full name required");
        else if(!formData.email?.trim())return toast.error("Email required");
        else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email))return toast.error("Invalid email");
        else if(!formData.password?.trim())return toast.error("Password required");
        else if(formData.password.trim().length<6)return toast.error("Password length must be atleast 6");
        return true;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Create an Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Fullname */}
                    <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                            placeholder="Fullname"
                        />
                    </div>
                    
                    {/* Email */}
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                            placeholder="Email"
                            
                        />
                    </div>
                    
                    {/* Password */}
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                            placeholder="Password"
                            
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md flex items-center justify-center disabled:bg-blue-300"
                        disabled={isSigningUp}
                    >
                        {isSigningUp ? (
                            <>
                                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
                                Loading...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>
                
                {/* Login Link */}
                <p className="text-center text-gray-600 mt-4">
                    Already have an account? 
                    <a href="/login" className="text-blue-500 hover:underline"> Sign in</a>
                </p>
            </div>
        </div>
    );
};
