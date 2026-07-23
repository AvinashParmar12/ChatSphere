import { io, Socket } from "socket.io-client";
import { getToken } from "@/utils/token";

// Derive the socket URL from the API URL. 
// Assuming VITE_API_URL is something like http://localhost:5000/api/v1
// The socket should connect to http://localhost:5000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const SOCKET_URL = API_URL.replace(/\/api\/v1\/?$/, "");

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
});

// Register listeners exactly once
socket.on("connect", () => {
  console.log("Socket Connected");
});

socket.on("disconnect", () => {
  console.log("Socket Disconnected");
});

socket.on("connect_error", (err) => {
  console.error("Socket Error", err.message);
});

export const connectSocket = () => {
  const token = getToken();
  if (token) {
    socket.auth = { token };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
