import { useMessageStore } from "../store/useMessageStore.js";
import { useEffect } from "react";

export const GroupChatSidebar = () => {
    const { isGetGroupMessagesLoading, getGroupUsers, groupUsers } = useMessageStore();

    // Fetch users when component mounts
    useEffect(() => {
        getGroupUsers();
        const interval = setInterval(getGroupUsers, 5000); // Auto-refresh users every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-64 h-screen bg-gray-900 text-white p-4 flex flex-col">
            <h2 className="text-lg font-bold mb-4">Group Chat</h2>

            {/* Loading Indicator */}
            {isGetGroupMessagesLoading ? (
                <p className="text-gray-400">Loading users...</p>
            ) : (
                <ul className="space-y-3 overflow-y-hidden ">
                    {groupUsers.length > 0 ? (
                        groupUsers.map((user, index) => (
                            <li key={index} className="flex items-center space-x-3 p-2 bg-gray-700 rounded-lg">
                                <img src={user.profilePic || "/default-profile.jpg"} alt={user.fullname} className="w-10 h-10 rounded-full" />
                                <span className="text-sm">{user.fullname}</span>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-400">No users online</p>
                    )}
                </ul>
            )}
        </div>
    );
};
