// ==============================
// Imports
// ==============================

import { Conversation } from "../conversations/conversation.model";
import { Message } from "./message.model";
import ApiError from "../../utils/ApiError";
import {
  emitNewMessage,
  emitMessageRead,
} from "../../socket/socketMessage";

// ==============================
// Send Message
// ==============================
export const sendMessage = async (
  senderId: string,
  conversationId: string,
  content: string
) => {
  // ==============================
  // Check Conversation
  const conversation =
    await Conversation.findById(
      conversationId
    );

  if (!conversation) {
    throw new ApiError(
      404,
      "Conversation not found"
    );
  }

  // ==============================
  // Verify Sender
  const isParticipant =
    conversation.participants.some(
      (participant) =>
        participant.toString() === senderId
    );

  if (!isParticipant) {
    throw new ApiError(
      403,
      "You are not a participant of this conversation"
    );
  }

  // ==============================
  // Create Message
  const message =
    await Message.create({
      conversation: conversationId,
      sender: senderId,
      content,
      readBy: [senderId],
    });

  // ==============================
  // Update Conversation
  conversation.lastMessage =
    message._id;

  conversation.lastMessageAt =
    message.createdAt;

  await conversation.save();


  // ==============================
  // Populate Message
  const populatedMessage =
    await Message.findById(
      message._id
    )
      .populate(
        "sender",
        "_id username avatar"
      )
      .populate(
        "conversation"
      );

  // ==============================
  // Find Recipient
  const recipient =
    conversation.participants.find(
      (participant) =>
        participant.toString() !== senderId
    );

  // ==============================
  // Emit Socket Event
  if (recipient && populatedMessage) {
    await emitNewMessage(
      recipient.toString(),
      populatedMessage
    );
  }

  return populatedMessage;
};


// ==============================
// Get Conversation Messages
// ==============================
export const getConversationMessages = async (
  conversationId: string,
  userId: string,
  page: number = 1,
  limit: number = 20
) => {
  // ==============================
  // Verify Conversation
  const conversation =
    await Conversation.findById(
      conversationId
    );

  if (!conversation) {
    throw new ApiError(
      404,
      "Conversation not found"
    );
  }

  // ==============================
  // Verify Participant
  const isParticipant =
    conversation.participants.some(
      (participant) =>
        participant.toString() === userId
    );

  if (!isParticipant) {
    throw new ApiError(
      403,
      "Access denied"
    );
  }

  // ==============================
  // Pagination
  const skip = (page - 1) * limit;

  // ==============================
  // Total Messages
  const totalMessages =
    await Message.countDocuments({
      conversation: conversationId,
    });

  // ==============================
  // Fetch Messages
  const messages = await Message.find({
    conversation: conversationId,
  })
    .populate(
      "sender",
      "_id username avatar"
    )
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit);

  // ==============================
  // Pagination Metadata
  const totalPages = Math.ceil(
    totalMessages / limit
  );

  return {
    messages,
    pagination: {
      page,
      limit,
      totalMessages,
      totalPages,
      hasNextPage:
        page < totalPages,
      hasPreviousPage:
        page > 1,
    },
  };
};

// ==============================
// Mark Conversation As Read
// ==============================
export const markConversationAsRead = async (
  conversationId: string,
  userId: string
) => {
  // ==============================
  // Verify Conversation
  const conversation =
    await Conversation.findById(
      conversationId
    );

  if (!conversation) {
    throw new ApiError(
      404,
      "Conversation not found"
    );
  }

  // ==============================
  // Verify Participant
  const isParticipant =
    conversation.participants.some(
      (participant) =>
        participant.toString() === userId
    );

  if (!isParticipant) {
    throw new ApiError(
      403,
      "Access denied"
    );
  }

  // ==============================
  // Mark Messages As Read
  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      readBy: { $ne: userId },
    },
    {
      $addToSet: {
        readBy: userId,
      },
    }
  );

  // ==============================
  // Find Other Participant
  const recipient =
    conversation.participants.find(
      (participant) =>
        participant.toString() !== userId
    );

  // ==============================
  // Emit Read Receipt
  if (recipient) {
    await emitMessageRead(
      recipient.toString(),
      conversationId,
      userId
    );
  }

  return {
    success: true,
  };
};