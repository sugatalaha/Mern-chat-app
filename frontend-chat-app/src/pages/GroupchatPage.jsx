import { GroupChatSidebar } from "../components/GroupChatSidebar.jsx";
import { GroupChatComponent } from "../components/GroupChatComponent.jsx";
import { useMessageStore } from "../store/useMessageStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { useEffect } from "react";

export const GroupChatPage = () => {
    const { getGroupUsers } = useMessageStore();
    const { socket, authUser } = useAuthStore();

    useEffect(() => {
        socket.emit("join-groupchat", authUser);
        getGroupUsers();
    }, []);

    return (
        <div className="flex h-screen">
            {/* Sidebar - 25% width */}
            <aside className="w-1/4 bg-gray-800 text-white p-4">
                <GroupChatSidebar />
            </aside>

            {/* Chat Component - 75% width */}
            <main className="w-3/4 bg-gray-900 text-white">
                <GroupChatComponent />
            </main>
        </div>
    );
};
