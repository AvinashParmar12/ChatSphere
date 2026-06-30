import { Server } from "socket.io";
import { Conversation } from "../../modules/conversations/conversation.model";
import { getSocketId } from "../socketPresence";


// ==============================
// Emit Typing Event
// ==============================
const emitTypingEvent = async (
  io: Server,
  conversationId: string,
  userId: string,
  event: "typing:start" | "typing:stop"
) => {
  // ==============================
  // Find Conversation
  // ==============================
  const conversation =
    await Conversation.findById(
      conversationId
    );

  if (!conversation) {
    return;
  }

  // ==============================
  // Emit To Other Participants
  // ==============================
  for (const participantId of conversation.participants) {
    if (
      participantId.toString() === userId
    ) {
      continue;
    }

    const socketId =
      await getSocketId(
        participantId.toString()
      );

    if (!socketId) {
      continue;
    }

    io.to(socketId).emit(event, {
      conversationId,
      userId,
    });
  }
};

// ==============================
// Typing Start
// ==============================
export const registerTypingStart =
  async (
    io: Server,
    conversationId: string,
    userId: string
  ) => {
    return emitTypingEvent(
      io,
      conversationId,
      userId,
      "typing:start"
    );
  };

// ==============================
// Typing Stop
// ==============================
export const registerTypingStop =
  async (
    io: Server,
    conversationId: string,
    userId: string
  ) => {
    return emitTypingEvent(
      io,
      conversationId,
      userId,
      "typing:stop"
    );
  };