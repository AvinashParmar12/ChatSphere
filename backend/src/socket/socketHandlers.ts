import { Server, Socket } from "socket.io";
import {
  saveSocketConnection,
  removeSocketConnection,
} from "./socketPresence";
import {
  setUserOnline,
  setUserOffline,
} from "../modules/users/user.presence";
import {
  registerTypingStart,
  registerTypingStop,
} from "./events/typing";
import {
  emitUserOnline,
  emitUserOffline,
} from "./events/presence";

// ==============================
// Register Socket Handlers
// ==============================

export const registerSocketHandlers = async (
  io: Server,
  socket: Socket,
  userId: string
): Promise<void> => {
  // ==============================
  // Save Socket Connection
  // ==============================
  await saveSocketConnection(
    userId,
    socket.id
  );

  // ==============================
  // Mark User Online
  // ==============================
  await setUserOnline(userId);

  // Emit User Online Event
  emitUserOnline(io, userId);

  console.log(`User Connected: ${userId}`);
  console.log(`Socket ID: ${socket.id}`);

// ==============================
// Typing Start
// ==============================
socket.on(
  "typing:start",
  async ({ conversationId }) => {
    await registerTypingStart(
      io,
      conversationId,
      userId
    );
  }
);

// ==============================
// Typing Stop
// ==============================
socket.on(
  "typing:stop",
  async ({ conversationId }) => {
    await registerTypingStop(
      io,
      conversationId,
      userId
    );
  }
);


  // ==============================
  // Disconnect Event
  // ==============================
  socket.on("disconnect", async () => {
    // ==============================
    // Remove Socket Connection
    // ==============================
    await removeSocketConnection(
      socket.id
    );

    // ==============================
    // Mark User Offline
    // ==============================
    await setUserOffline(userId);

    // Emit User Offline Event
    emitUserOffline(io, userId);

    console.log(
      `User Disconnected: ${userId}`
    );

    console.log(
      `Socket ID: ${socket.id}`
    );
  });
};