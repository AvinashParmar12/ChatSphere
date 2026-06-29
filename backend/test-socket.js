const { io } = require("socket.io-client");

// ==============================
// Access Token
// ==============================
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTNhMzZmZGZiNTk4YTZmYzllZjA4NjIiLCJpYXQiOjE3ODI3MzQxNTksImV4cCI6MTc4MjczNTA1OX0.4M3hNH9WXBFywvqx2BZiKi-TTKU0A7w7ylVDhiV4Qn0";

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
socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

// ==============================
// Connection Error
// ==============================
socket.on("connect_error", (error) => {
  console.log("Connection Error:", error.message);
});

// ==============================
// New Message Event
// ==============================
socket.on("new_message", (message) => {
  console.log("\n📩 New Message Received:");
  console.log(message);
});

// ==============================
// Message Read Event
// ==============================

socket.on("message_read", (data) => {
  console.log("\n👀 Message Read:");
  console.log(data);
});