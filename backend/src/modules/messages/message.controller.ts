// ==============================
// Imports
// ==============================

import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import { 
  sendMessage,
  sendMediaMessage, 
  getConversationMessages, 
  markConversationAsRead,
  deleteMessage,
} from "./message.service";

// ==============================
// Send Message
// ==============================
export const sendMessageController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const userId =
        req.userId as string;

      const {
        conversationId,
        content,
      } = req.body;

      const message =
        await sendMessage(
          userId,
          conversationId,
          content
        );

      res.status(201).json(
        new ApiResponse(
          "Message sent successfully",
          message
        )
      );
    }
  );

// ==============================
// Send Media Message
// ==============================
export const sendMediaMessageController =
  asyncHandler(async (req, res) => {
    const senderId = req.userId as string;

    const file = req.file;

    const {
      conversationId,
      content,
      messageType,
    } = req.body;

    const message =
      await sendMediaMessage({
        senderId,
        conversationId,
        content,
        messageType,
        file,
      });

    res.status(201).json(
      new ApiResponse(
        "Media message sent successfully",
        message
      )
    );
  });

// ==============================
// Get Conversation Messages
// ==============================
export const getConversationMessagesController =
  asyncHandler(async (req, res) => {
    const userId = req.userId as string;

    const {
      conversationId,
    } = req.params;


// ==============================
// Pagination Query
// ==============================
let page =
  Number(req.query.page) || 1;

let limit =
  Number(req.query.limit) || 20;

// ==============================
// Validate Page
// ==============================
if (page < 1) {
  page = 1;
}

// ==============================
// Validate Limit
// ==============================
if (limit < 1) {
  limit = 20;
}

if (limit > 100) {
  limit = 100;
}

    const messages =
      await getConversationMessages(
        conversationId as string,
        userId,
        page,
        limit
      );

    res.status(200).json(
      new ApiResponse(
        "Messages fetched successfully",
        messages
      )
    );
  });

// ==============================
// Mark Conversation As Read
// ==============================
export const markConversationRead =
  asyncHandler(
    async (req: Request, res: Response) => {
      const result =
        await markConversationAsRead(
          req.params.conversationId as string,
          req.userId as string
        );

      res.status(200).json(
        new ApiResponse(
          "Conversation marked as read",
          result
        )
      );
    }
  );

// ==============================
// Delete Message
// ==============================
export const deleteMessageController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const { messageId } = req.params;

      const result =
        await deleteMessage(
          messageId as string,
          req.userId as string
        );

      res.status(200).json(
        new ApiResponse(
          "Message deleted successfully",
          result
        )
      );
    }
  );