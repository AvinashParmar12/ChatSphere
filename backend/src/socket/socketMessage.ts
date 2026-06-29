// ==============================
// Imports
// ==============================

import { getIO } from "./socket";
import { getSocketId } from "./socketPresence";

// ==============================
// Emit New Message
// ==============================
export const emitNewMessage = async (
  recipientUserId: string,
  message: unknown
): Promise<void> => {
  // ==============================
  // Find Recipient Socket
  const socketId =
    await getSocketId(recipientUserId);

  // User is offline
  if (!socketId) {
    return;
  }

  // ==============================
  // Emit Event
  const io = getIO();

  io.to(socketId).emit(
    "new_message",
    message
  );
};


// ==============================
// Emit Message Read
// ==============================
export const emitMessageRead = async (
  recipientUserId: string,
  conversationId: string,
  readerUserId: string
): Promise<void> => {
  // ==============================
  // Find Recipient Socket
  const socketId = await getSocketId(
    recipientUserId
  );

  // Recipient Offline
  if (!socketId) {
    return;
  }

  // ==============================
  // Emit Event
  const io = getIO();

  io.to(socketId).emit(
    "message_read",
    {
      conversationId,
      readerUserId,
    }
  );
};