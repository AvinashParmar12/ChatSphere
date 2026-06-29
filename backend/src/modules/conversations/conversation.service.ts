// ==============================
// Imports
// ==============================

import { Types } from "mongoose";
import ApiError from "../../utils/ApiError";
import { Conversation } from "./conversation.model";

// ==============================
// Create Conversation
// ==============================

export const createConversation = async (
    senderId: string,
    receiverId: string
) => {
    // ==============================
    // Prevent Self Conversation
    // ==============================
    if (senderId === receiverId) {
        throw new ApiError(
            400,
            "You cannot create a conversation with yourself"
        );
    }

    // ==============================
    // Check Existing Conversation
    // ==============================
    const existingConversation =
        await Conversation.findOne({
            participants: {
                $all: [
                    new Types.ObjectId(senderId),
                    new Types.ObjectId(receiverId),
                ],
            },
        }).populate(
            "participants",
            "_id username avatar"
        );

    if (existingConversation) {
        return existingConversation;
    }

    // ==============================
    // Create New Conversation
    // ==============================
    const conversation =
        await Conversation.create({
            participants: [
                senderId,
                receiverId,
            ],
        });

    // ==============================
    // Return Populated Conversation
    // ==============================
    const populatedConversation =
        await Conversation.findById(
            conversation._id
        ).populate(
            "participants",
            "_id username avatar"
        );

    if (!populatedConversation) {
        throw new ApiError(
            500,
            "Failed to create conversation"
        );
    }

    return populatedConversation;
};



// ==============================
// Get User Conversations
// ==============================
export const getUserConversations =
    async (userId: string) => {
        const conversations =
            await Conversation.find({
                participants: userId,
            })
                .populate(
                    "participants",
                    "_id username avatar bio"
                )
                .populate({
                    path: "lastMessage",
                    populate: {
                        path: "sender",
                        select: "_id username avatar",
                    },
                })
                .sort({
                    lastMessageAt: -1,
                });

        return conversations;
    };



// ==============================
// Get Conversation By ID
// ==============================
export const getConversationById = async (
    conversationId: string,
    userId: string
) => {
    const conversation =
        await Conversation.findOne({
            _id: conversationId,
            participants: userId,
        }).populate(
            "participants",
            "_id username avatar bio"
        )
            .populate({
                path: "lastMessage",
                populate: {
                    path: "sender",
                    select: "_id username avatar",
                },
            });

    if (!conversation) {
        throw new ApiError(
            404,
            "Conversation not found"
        );
    }

    return conversation;
};
