import {io} from "socket.io-client";

const socket=io(process.env.IO_URL || "http://127.0.0.1:3000")

export default socket;