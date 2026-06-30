import { Server } from "socket.io";

// ==============================
// User Online
// ==============================
export const emitUserOnline = (
  io: Server,
  userId: string
) => {
  io.emit("user:online", {
    userId,
  });
};

// ==============================
// User Offline
// ==============================
export const emitUserOffline = (
  io: Server,
  userId: string
) => {
  io.emit("user:offline", {
    userId,
  });
};