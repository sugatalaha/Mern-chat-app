import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userSocketMap = {}; 

const groupChatUsers={};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const userId=socket.handshake.query.userId;
  if(userId!==undefined)
    {
      userSocketMap[userId]=socket.id;
    }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    const userId=socket.handshake.query.userId;
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("join-groupchat",(user)=>
  {
    if (user !== undefined && !(user._id in groupChatUsers) ) {
      groupChatUsers[user._id]=user;
    }
    
    io.emit("getGroupChatUsers",Object.values(groupChatUsers));
  });

  io.removeAllListeners('exit-groupchat');
  socket.on("exit-groupchat",(user)=>
  {
    if(user!==undefined && (user._id in groupChatUsers))
      {
        delete groupChatUsers[user._id];
      }
      io.emit("getGroupChatUsers",Object.values(groupChatUsers));
  })
});

export { io, app, server };
