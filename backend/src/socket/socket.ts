import { Server } from "socket.io";
import { authenticateSocket } from "./socketAuth";
import { registerSocketHandlers } from "./socketHandlers";

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
  io.on("connection", async (socket) => {
    try {
      // ==============================
      // Authenticate Socket
      // ==============================
      const userId = authenticateSocket(socket);

      // ==============================
      // Register Socket Handlers
      // ==============================
      await registerSocketHandlers(
        io,
        socket,
        userId
      );
    } catch (error) {
      console.log("Socket Authentication Failed");

      socket.disconnect(true);
    }
  });
}; // ✅ initializeSocket ends here

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