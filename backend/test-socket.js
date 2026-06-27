const { io } = require("socket.io-client");

// ==============================
// Access Token
// ==============================
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTNhMzZmZGZiNTk4YTZmYzllZjA4NjIiLCJpYXQiOjE3ODI1MzY1NzksImV4cCI6MTc4MjUzNzQ3OX0.X3DIaOUkLMIOC9v3YwgYrMpf82XIi-o21rU8H_2BVBo";

// ==============================
// Connect Socket
// ==============================
const socket = io("http://localhost:5000", {
  auth: {
    token: ACCESS_TOKEN,
  },
});

// ==============================
// Connected
// ==============================
socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

// ==============================
// Disconnected
// ==============================
socket.on("disconnect", () => {
  console.log("Disconnected");
});

// ==============================
// Connection Error
// ==============================
socket.on("connect_error", (error) => {
  console.log("Connection Error:", error.message);
});