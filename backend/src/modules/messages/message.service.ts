// ==============================
// Imports
// ==============================

import { Conversation } from "../conversations/conversation.model";
import { Message } from "./message.model";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import ApiError from "../../utils/ApiError";
import {
  emitNewMessage,
  emitMessageRead,
} from "../../socket/socketMessage";
import { MessageType } from "./message.types";

// ==============================
// Verify Conversation and Participant
// ==============================
const verifyConversationParticipant = async (
  conversationId: string,
  userId: string
) => {
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

  const isParticipant =
    conversation.participants.some(
      (participant) =>
        participant.toString() === userId
    );

  if (!isParticipant) {
    throw new ApiError(
      403,
      "You are not a participant of this conversation"
    );
  }

  return conversation;
};

// ==============================
// Send Message
// ==============================
export const sendMessage = async (
  senderId: string,
  conversationId: string,
  content: string
) => {

  // Verify Conversation and Participant
  const conversation =
    await verifyConversationParticipant(
      conversationId,
      senderId
    );

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
// Send Message With Media
// ==============================
export const sendMediaMessage = async ({
  senderId,
  conversationId,
  content,
  messageType,
  file,
}: {
  senderId: string;
  conversationId: string;
  content?: string;
  messageType: MessageType;
  file?: Express.Multer.File;
}) => {
  const conversation =
    await verifyConversationParticipant(
      conversationId,
      senderId
    );
  if (!file) {
    throw new ApiError(
      400,
      "Media file is required"
    );
  }
  const uploadResult =
    await uploadToCloudinary(
      file.buffer,
      "chatsphere/messages"
    );
  const attachment = {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    fileName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
  // ==============================
  // Create Message

  const message =
    await Message.create({
      conversation: conversationId,
      sender: senderId,
      messageType,
      content: content ?? "",
      attachment,
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
export const getConversationMessages = async (
  conversationId: string,
  userId: string,
  page: number = 1,
  limit: number = 20
) => {

  // Verify Conversation and Participant
  const conversation =
    await verifyConversationParticipant(
      conversationId,
      userId
    );

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

  // Verify Conversation and Participant
  const conversation =
    await verifyConversationParticipant(
      conversationId,
      userId
    );

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