import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";

const PORT = 3000;
const app = express();

app.use(express.json());

const server = createServer(app);
const users = {};

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

io.on("connection", (socket) => {
    // New user joins
    socket.on("new-user-joined", (username) => {
        console.log(username, users[username]);

        if (users[username]) {
            // Emit an error if the username already exists
            socket.emit("error", { message: "Username already taken!" });
            return;
        }

        // Add the user to the active list
        users[username] = socket.id; 
        console.log(`${username} has joined`);

        // Acknowledge successful login
        socket.emit("success", { message: "Login successful!" });

        // Notify all clients of the updated user list
        io.emit("active-user-list", Object.keys(users));
        socket.broadcast.emit("user-joined", username);
    });

    // Handle new message
    socket.on("new-message", ({ username, message }) => {
        console.log(username, message);
        socket.broadcast.emit("new-message", { username, message });
    });

    // Handle private chat
    socket.on("private-chat", ({ toUsername, message }) => {
        const toSocketId = users[toUsername];
        if (toSocketId) {
            io.to(toSocketId).emit("private-chat", {
                from: socket.id,
                message,
            });
        } else {
            socket.emit("error", { message: "User not found!" });
        }
    });

    // Handle user disconnect
    socket.on("disconnect", (username_disconnected) => {
        let disconnectedUser = null;
        for (let username in users) {
            if (users[username] === socket.id) {
                disconnectedUser = username;
                console.log(`${username} exited`);
                delete users[username];
                break;
            }
        }
        if (disconnectedUser) {
            console.log(`${disconnectedUser} has exited!`);
            socket.broadcast.emit("user-exited", disconnectedUser);
            socket.broadcast.emit("active-user-list", Object.keys(users)); // Emit updated list
        }
    });
    socket.on("disconnect-user", (username_disconnected) => {
        let disconnectedUser = null;
        for (let username in users) {
            if (users[username] === socket.id) {
                disconnectedUser = username;
                console.log(`${username} exited`);
                delete users[username];
                break;
            }
        }
        if (disconnectedUser) {
            console.log(`${disconnectedUser} has exited!`);
            socket.broadcast.emit("user-exited", disconnectedUser);
            socket.broadcast.emit("active-user-list", Object.keys(users)); // Emit updated list
        }
    });
});


server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
