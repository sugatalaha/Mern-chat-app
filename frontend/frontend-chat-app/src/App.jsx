import "./index.css";
import React,{useEffect} from "react";
import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { SignupPage } from "./pages/SignupPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import {Loader} from "lucide-react"
import { Toaster} from "react-hot-toast";
import { GroupChatPage } from "./pages/GroupchatPage.jsx";

function App() {
  const {authUser,checkAuth,isCheckingAuth}=useAuthStore();
  useEffect(()=>
  {
    checkAuth();
  },[checkAuth])
  if(!authUser && isCheckingAuth)
  {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={(authUser)?<HomePage />:<Navigate to="/login"/>} />
        <Route path="/signup" element={(!authUser)?<SignupPage />:<Navigate to="/"/>} />
        <Route path="/login" element={(!authUser)?<LoginPage />:<Navigate to="/"/>} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={(authUser)?<ProfilePage />:<Navigate to="/login"/>} />
        <Route path="/groupchat" element={(authUser?<GroupChatPage/>:<Navigate to="/login"/>)}/>
      </Routes>
    </Router>
    <Toaster/>
    </>
  );
}

export default App;

