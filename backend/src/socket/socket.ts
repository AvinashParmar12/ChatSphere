import { Server } from "socket.io";

// ==============================
// Socket.IO Instance
// ==============================
let io: Server;

// ==============================
// Initialize Socket.IO
// ==============================
export const initializeSocket = (
  socketServer: Server
): void => {
  io = socketServer;

  // ==============================
  // Connection Event
  // ==============================
  io.on("connection", (socket) => {
    console.log(
      `Socket Connected: ${socket.id}`
    );

    // ==============================
    // Disconnect Event
    // ==============================
    socket.on("disconnect", () => {
      console.log(
        `Socket Disconnected: ${socket.id}`
      );
    });
  });
};

// ==============================
// Get Socket.IO Instance
// ==============================
export const getIO = (): Server => {
  if (!io) {
    throw new Error(
      "Socket.IO not initialized"
    );
  }
  return io;
};