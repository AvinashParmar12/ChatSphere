// ==============================
// Imports
// ==============================

import { Types } from "mongoose";
import ApiError from "../../utils/ApiError";
import { Conversation } from "./conversation.model";
import { Message } from "../messages/message.model";
import User from "../auth/user.model";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinaryUpload";
import {
  notifyUsers,
  notifyGroupParticipants,
} from "../notifications/notification.service";
import { createSystemMessage } from "../messages/message.service";

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
    uniqueParticipants.length < 2
  ) {
    throw new ApiError(
      400,
      "Group must contain at least 2 members"
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
  // Get Creator
  // ==============================

  const creator = await User.findById(
    creatorId
  ).select("username");

  if (!creator) {
    throw new ApiError(
      404,
      "Creator not found"
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
  // Create System Message
  // ==============================

  await createSystemMessage({
    conversation:
      conversation._id,
    sender: creatorId,
    content: `${creator.username} created the group`,
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
// Rename Group
// ==============================

export const renameGroup = async (
  groupId: string,
  userId: string,
  groupName: string
) => {
  // ==============================
  // Find Group
  // ==============================

  const group =
    await Conversation.findById(groupId);

  if (!group) {
    throw new ApiError(
      404,
      "Group not found"
    );
  }

  // ==============================
  // Verify Group
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
  // Verify Admin
  // ==============================

  if (
    group.groupAdmin?.toString() !== userId
  ) {
    throw new ApiError(
      403,
      "Only group admin can rename the group"
    );
  }

  // ==============================
  // Get Admin
  // ==============================

  const admin =
    await User.findById(userId).select(
      "username"
    );

  if (!admin) {
    throw new ApiError(
      404,
      "Admin not found"
    );
  }

  // ==============================
  // Update Group Name
  // ==============================

  group.groupName = groupName;

  await group.save();

  // ==============================
  // Create System Message
  // ==============================

  await createSystemMessage({
    conversation: group._id,
    sender: userId,
    content: `${admin.username} renamed the group to "${group.groupName}"`,
  });

  // ==============================
  // Create Notifications
  // ==============================

  await notifyGroupParticipants({
    participants: group.participants,
    sender: userId,
    conversation: group._id,
    type: "GROUP_RENAME",
    title: "Group Renamed",
    message: `${admin.username} renamed the group to "${group.groupName}"`,
    excludeUsers: [userId],
  });

  // ==============================
  // Return Updated Group
  // ==============================

  return await Conversation.findById(
    group._id
  )
    .populate(
      "participants",
      "_id username avatar"
    )
    .populate(
      "groupAdmin",
      "_id username avatar"
    );
};

// ==============================
// Add Group Members
// ==============================

export const addGroupMembers = async (
  groupId: string,
  userId: string,
  participants: string[]
) => {
  // ==============================
  // Find Group
  // ==============================

  const group =
    await Conversation.findById(groupId);

  if (!group) {
    throw new ApiError(
      404,
      "Group not found"
    );
  }

  // ==============================
  // Verify Group
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
  // Verify Admin
  // ==============================

  if (
    group.groupAdmin?.toString() !== userId
  ) {
    throw new ApiError(
      403,
      "Only group admin can add members"
    );
  }

  // ==============================
  // Verify Users Exist
  // ==============================

  const users =
    await User.find({
      _id: { $in: participants },
    }).select("_id username");

  if (
    users.length !== participants.length
  ) {
    throw new ApiError(
      404,
      "One or more users not found"
    );
  }

  // ==============================
  // Add New Members Only
  // ==============================

  const existingMembers =
    group.participants.map((id) =>
      id.toString()
    );

  const newMembers =
    participants.filter(
      (id) =>
        !existingMembers.includes(id)
    );

  group.participants.push(
    ...newMembers.map(
      (id) =>
        new Types.ObjectId(id)
    )
  );

  await group.save();
// ==============================
// Get Admin
// ==============================

const admin =
  await User.findById(userId).select(
    "username"
  );

if (!admin) {
  throw new ApiError(
    404,
    "Admin not found"
  );
}

// ==============================
// Create System Message
// ==============================

const addedUserNames =
  users
    .filter((user) =>
      newMembers.includes(
        user._id.toString()
      )
    )
    .map((user) => user.username)
    .join(", ");

await createSystemMessage({
  conversation: group._id,
  sender: userId,
  content: `${admin.username} added ${addedUserNames}`,
});

  // ==============================
// Create Notifications
// ==============================

await notifyUsers({
  users: participants,
  sender: userId,
  conversation: group._id,
  type: "GROUP_ADD",
  title: "Added to Group",
  message: `You were added to "${group.groupName}"`,
});

  // ==============================
  // Return Updated Group
  // ==============================

  return await Conversation.findById(
    group._id
  )
    .populate(
      "participants",
      "_id username avatar"
    )
    .populate(
      "groupAdmin",
      "_id username avatar"
    );
};

// ==============================
// Remove Group Members
// ==============================

export const removeGroupMembers = async (
  groupId: string,
  userId: string,
  participants: string[]
) => {
  // ==============================
  // Find Group
  // ==============================

  const group =
    await Conversation.findById(groupId);

  if (!group) {
    throw new ApiError(
      404,
      "Group not found"
    );
  }

  // ==============================
  // Verify Group
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
  // Verify Admin
  // ==============================

  if (
    group.groupAdmin?.toString() !== userId
  ) {
    throw new ApiError(
      403,
      "Only group admin can remove members"
    );
  }

  // ==============================
  // Cannot Remove Yourself
  // ==============================

  if (participants.includes(userId)) {
    throw new ApiError(
      400,
      "Group admin cannot remove themselves. Use Leave Group instead."
    );
  }

  // ==============================
  // Verify Members
  // ==============================

  const memberIds =
    group.participants.map((id) =>
      id.toString()
    );

  for (const participant of participants) {
    if (!memberIds.includes(participant)) {
      throw new ApiError(
        400,
        "User is not a member of the group"
      );
    }

    if (
      participant ===
      group.groupAdmin?.toString()
    ) {
      throw new ApiError(
        400,
        "Cannot remove group admin"
      );
    }
  }
  // ==============================
// Get Removed Users
// ==============================

const users = await User.find({
  _id: {
    $in: participants,
  },
}).select("_id username");

// ==============================
// Get Admin
// ==============================

const admin = await User.findById(
  userId
).select("username");

if (!admin) {
  throw new ApiError(
    404,
    "Admin not found"
  );
}
  // ==============================
  // Remove Members
  // ==============================

  group.participants =
    group.participants.filter(
      (participant) =>
        !participants.includes(
          participant.toString()
        )
    );

  await group.save();
// ==============================
// Create System Message
// ==============================

const removedUserNames =
  users
    .map((user) => user.username)
    .join(", ");

await createSystemMessage({
  conversation: group._id,
  sender: userId,
  content: `${admin.username} removed ${removedUserNames}`,
});
// ==============================
// Create Notifications
// ==============================

await notifyGroupParticipants({
  participants: group.participants,
  sender: userId,
  conversation: group._id,
  type: "GROUP_REMOVE",
  title: "Member Removed",
  message: `${admin.username} removed ${removedUserNames} from "${group.groupName}"`,
  excludeUsers: [userId],
});
  // ==============================
  // Return Updated Group
  // ==============================

  return await Conversation.findById(
    group._id
  )
    .populate(
      "participants",
      "_id username avatar"
    )
    .populate(
      "groupAdmin",
      "_id username avatar"
    );
};

// ==============================
// Leave Group
// ==============================

export const leaveGroup = async (
  groupId: string,
  userId: string
) => {
  // ==============================
  // Find Group
  // ==============================

  const group =
    await Conversation.findById(groupId);

  if (!group) {
    throw new ApiError(
      404,
      "Group not found"
    );
  }

  // ==============================
  // Verify Group
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
  // Get User
  // ==============================

  const user =
    await User.findById(userId).select(
      "username"
    );

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  // ==============================
  // Remove Current User
  // ==============================

  group.participants =
    group.participants.filter(
      (participant) =>
        participant.toString() !== userId
    );

  // ==============================
  // If Admin Left
  // ==============================

  if (
    group.groupAdmin?.toString() === userId
  ) {
    // No members left
    if (
      group.participants.length === 0
    ) {
      await Conversation.findByIdAndDelete(
        groupId
      );

      return {
        deleted: true,
      };
    }

    // Assign new admin
    group.groupAdmin =
      group.participants[0];
  }

  await group.save();

  // ==============================
  // Create System Message
  // ==============================

  await createSystemMessage({
    conversation: group._id,
    sender: userId,
    content: `${user.username} left the group`,
  });

  // ==============================
  // Create Notifications
  // ==============================

  await notifyGroupParticipants({
    participants: group.participants,
    sender: userId,
    conversation: group._id,
    type: "GROUP_LEAVE",
    title: "Member Left",
    message: `${user.username} left "${group.groupName}"`,
    excludeUsers: [userId],
  });

  // ==============================
  // Return Updated Group
  // ==============================

  const updatedGroup =
    await Conversation.findById(
      group._id
    )
      .populate(
        "participants",
        "_id username avatar"
      )
      .populate(
        "groupAdmin",
        "_id username avatar"
      );

  return {
    deleted: false,
    group: updatedGroup,
  };
};

// ==============================
// Update Group Avatar
// ==============================

export const updateGroupAvatar = async (
  groupId: string,
  userId: string,
  file: Express.Multer.File
) => {
  // ==============================
  // Verify File
  // ==============================

  if (!file) {
    throw new ApiError(
      400,
      "Avatar image is required"
    );
  }

  // ==============================
  // Find Group
  // ==============================

  const group =
    await Conversation.findById(groupId);

  if (!group) {
    throw new ApiError(
      404,
      "Group not found"
    );
  }

  // ==============================
  // Verify Group
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
  // Verify Admin
  // ==============================

  if (
    group.groupAdmin?.toString() !== userId
  ) {
    throw new ApiError(
      403,
      "Only group admin can update avatar"
    );
  }

  // ==============================
  // Get Admin
  // ==============================

  const admin =
    await User.findById(userId).select(
      "username"
    );

  if (!admin) {
    throw new ApiError(
      404,
      "Admin not found"
    );
  }

  // ==============================
  // Delete Previous Avatar
  // ==============================

  if (group.groupAvatarPublicId) {
    await deleteFromCloudinary(
      group.groupAvatarPublicId
    );
  }

  // ==============================
  // Upload New Avatar
  // ==============================

  const uploadedImage =
    await uploadToCloudinary(
      file.buffer,
      "chatsphere/group-avatar"
    );

  // ==============================
  // Save Avatar
  // ==============================

  group.groupAvatar =
    uploadedImage.secure_url;

  group.groupAvatarPublicId =
    uploadedImage.public_id;

  await group.save();

  // ==============================
  // Create System Message
  // ==============================

  await createSystemMessage({
    conversation: group._id,
    sender: userId,
    content: `${admin.username} updated the group avatar`,
  });

  // ==============================
  // Create Notifications
  // ==============================

  await notifyGroupParticipants({
    participants: group.participants,
    sender: userId,
    conversation: group._id,
    type: "GROUP_AVATAR",
    title: "Group Avatar Updated",
    message: `${admin.username} updated the group avatar`,
    excludeUsers: [userId],
  });

  // ==============================
  // Return Updated Group
  // ==============================

  return await Conversation.findById(
    group._id
  )
    .populate(
      "participants",
      "_id username avatar"
    )
    .populate(
      "groupAdmin",
      "_id username avatar"
    );
};
// ==============================
// Delete Group
// ==============================

export const deleteGroup = async (
  groupId: string,
  userId: string
) => {
  // ==============================
  // Find Group
  // ==============================

  const group =
    await Conversation.findById(groupId);

  if (!group) {
    throw new ApiError(
      404,
      "Group not found"
    );
  }

  // ==============================
  // Verify Group
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
  // Verify Admin
  // ==============================

  if (
    group.groupAdmin?.toString() !== userId
  ) {
    throw new ApiError(
      403,
      "Only group admin can delete the group"
    );
  }

  // ==============================
  // Delete Group Avatar
  // ==============================

  if (group.groupAvatarPublicId) {
    try {
      await deleteFromCloudinary(
        group.groupAvatarPublicId
      );
    } catch {
      // Ignore Cloudinary failure
    }
  }

  // ==============================
  // Find Attachments
  // ==============================

  const messages =
    await Message.find(
      {
        conversation: groupId,
      },
      "attachment.publicId"
    );

  // ==============================
  // Delete Attachments
  // ==============================

  for (const message of messages) {
    if (
      message.attachment?.publicId
    ) {
      try {
        await deleteFromCloudinary(
          message.attachment.publicId
        );
      } catch {
        // Ignore Cloudinary failure
      }
    }
  }

  // ==============================
  // Delete Messages
  // ==============================

  await Message.deleteMany({
    conversation: groupId,
  });

  // ==============================
  // Delete Conversation
  // ==============================

  await Conversation.findByIdAndDelete(
    groupId
  );
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
