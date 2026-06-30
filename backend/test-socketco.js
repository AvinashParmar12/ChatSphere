const { io } = require("socket.io-client");

// ==============================
// Access Token
// ==============================
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTNhMzZmZGZiNTk4YTZmYzllZjA4NjIiLCJpYXQiOjE3ODI4MTkyOTEsImV4cCI6MTc4MjgyMDE5MX0.peexoab8qAR6l6XZE7fFAmQXJQ5bnTv-9PUPMuvc7UE";

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

  setTimeout(() => {
    socket.emit("typing:start", {
      conversationId:
        "6a4247f735d874d510206e95",
    });

    console.log("⌨️ Sent typing:start");
  }, 3000);

  setTimeout(() => {
    socket.emit("typing:stop", {
      conversationId:
        "6a4247f735d874d510206e95",
    });

    console.log("🛑 Sent typing:stop");
  }, 6000);
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

// ==============================
// Typing Started
// ==============================
socket.on("typing:start", (data) => {
  console.log("\n⌨️ Typing Started:");
  console.log(data);
});

// ==============================
// Typing Stopped
// ==============================
socket.on("typing:stop", (data) => {
  console.log("\n🛑 Typing Stopped:");
  console.log(data);
});
