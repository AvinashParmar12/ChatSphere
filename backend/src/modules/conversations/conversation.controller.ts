// ==============================
// Imports
// ==============================

import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import {
  createConversation,
  getUserConversations,
  getConversationById
} from "./conversation.service";

// ==============================
// Create Conversation
// ==============================

export const createNewConversationController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const conversation =
        await createConversation(
          req.userId as string,
          req.body.receiverId
        );

      res.status(201).json(
        new ApiResponse(
          "Conversation created successfully",
          conversation
        )
      );
    }
  );


// ==============================
// Get User Conversations
// ==============================
export const getConversationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const conversations =
      await getUserConversations(
        req.userId as string
      );

    res.status(200).json(
      new ApiResponse(
        "Conversations fetched successfully",
        conversations
      )
    );
  }
);

// ==============================
// Get Conversation By ID
// ==============================
export const getConversationByIdController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const { conversationId } = req.params;

      const conversation =
        await getConversationById(
          conversationId as string,
          req.userId as string
        );

      res.status(200).json(
        new ApiResponse(
          "Conversation fetched successfully",
          conversation
        )
      );
    }
  );