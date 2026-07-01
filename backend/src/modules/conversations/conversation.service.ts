// ==============================
// Imports
// ==============================

import { Types } from "mongoose";
import ApiError from "../../utils/ApiError";
import { Conversation } from "./conversation.model";
import { Message } from "../messages/message.model";
import User from "../auth/user.model";

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
// Create Group Conversation
// ==============================
export const createGroupConversation = async ({
  creatorId,
  groupName,
  participants,
}: {
  creatorId: string;
  groupName: string;
  participants: string[];
}) => {
// ==============================
// Remove Duplicate Participants
// ==============================

const uniqueParticipants = [
  ...new Set(participants),
];
// ==============================
// Add Creator
// ==============================

if (
  !uniqueParticipants.includes(
    creatorId
  )
) {
  uniqueParticipants.push(
    creatorId
  );
}
// ==============================
// Validate Member Count
// ==============================

if (
  uniqueParticipants.length < 3
) {
  throw new ApiError(
    400,
    "Group must contain at least 3 members"
  );
}
// ==============================
// Verify Participants
// ==============================

const users = await User.find({
  _id: {
    $in: uniqueParticipants,
  },
}).select("_id");

if (
  users.length !==
  uniqueParticipants.length
) {
  throw new ApiError(
    404,
    "One or more participants were not found"
  );
}
// ==============================
// Create Group
// ==============================

const conversation =
  await Conversation.create({
    participants:
      uniqueParticipants,
    isGroup: true,
    groupName,
    groupAdmin: creatorId,
  });
  // ==============================
// Populate Group
// ==============================

const populatedConversation =
  await Conversation.findById(
    conversation._id
  )
    .populate(
      "participants",
      "_id username avatar bio"
    )
    .populate(
      "groupAdmin",
      "_id username avatar"
    );

return populatedConversation;
};

// ==============================
// Get Group By ID
// ==============================

export const getGroupById = async (
  groupId: string,
  userId: string
) => {
  // ==============================
  // Find Group
  // ==============================

  const group =
    await Conversation.findById(groupId)
      .populate(
        "participants",
        "_id username avatar"
      )
      .populate(
        "groupAdmin",
        "_id username avatar"
      )
      .populate(
        "lastMessage"
      );

  if (!group) {
    throw new ApiError(
      404,
      "Group not found"
    );
  }

  // ==============================
  // Verify Conversation Type
  // ==============================

  if (!group.isGroup) {
    throw new ApiError(
      400,
      "Conversation is not a group"
    );
  }

  // ==============================
  // Verify Participant
  // ==============================

  const isParticipant =
    group.participants.some(
      (participant: any) =>
        participant._id.toString() ===
        userId
    );

  if (!isParticipant) {
    throw new ApiError(
      403,
      "Access denied"
    );
  }

  return group;
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
    // ==============================
    // Add Unread Count
    // ==============================
    const conversationsWithUnreadCount =
      await Promise.all(
        conversations.map(
          async (conversation) => {
            const unreadCount =
              await Message.countDocuments({
                conversation:
                  conversation._id,
                sender: {
                  $ne: userId,
                },
                readBy: {
                  $ne: userId,
                },
              });

            return {
              ...conversation.toObject(),
              unreadCount,
            };
          }
        )
      );

    return conversationsWithUnreadCount;
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
