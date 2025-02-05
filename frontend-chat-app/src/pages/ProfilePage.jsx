import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";

export const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const fullName = authUser.fullname;
  const [profilePic, setProfilePic] = useState(authUser?.profilePic || "");
  const [preview, setPreview] = useState(authUser?.profilePic || "");
  const [base64Image, setBase64Image] = useState("");
  
  const handleUploadProfilePic = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setBase64Image(reader.result); // Set base64 only after reader finishes
      };
      reader.readAsDataURL(file);
      setProfilePic(file);
    }
  };
  
  const handleSave = async () => {
    if (!base64Image) {
      console.error("Base64 image is empty!");
      return;
    }
    await updateProfile({ profilePic: base64Image });
  };
  

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-xl font-semibold mb-4">Profile Page</h2>
      <div className="relative inline-block">
        <img
          src={preview || "frontend/frontend-chat-app/public/default-profile.jpg"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleUploadProfilePic}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="mt-4 text-left">
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={fullName}
          disabled
          className="w-full p-2 border rounded mt-1"
        />
        <label className="block text-sm font-medium mt-3">Email</label>
        <input
          type="email"
          value={authUser?.email || ""}
          disabled
          className="w-full p-2 border rounded mt-1 bg-gray-100"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={isUpdatingProfile}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isUpdatingProfile ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};
