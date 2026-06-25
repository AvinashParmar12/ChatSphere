import User from "../auth/user.model";
import ApiError from "../../utils/ApiError";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

interface UpdateProfileInput {
  username?: string;
  bio?: string;
}

// ==============================
// Update User Profile
// ==============================
export const updateProfile = async (
  userId: string,
  payload: UpdateProfileInput
) => {
  const { username, bio } = payload;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // ==============================
  // Username Uniqueness Check
  // ==============================
  if (
    username &&
    username !== user.username
  ) {
    const existingUser = await User.findOne({
      username,
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "Username already taken"
      );
    }

    user.username = username;
  }

  // ==============================
  // Update Bio
  // ==============================
  if (bio !== undefined) {
    user.bio = bio;
  }

  await user.save();

  const updatedUser = await User.findById(
    user._id
  );

  return updatedUser;
};

// ==============================
// Search Users
// ==============================
export const searchUsers = async (
  currentUserId: string,
  query: string
) => {
    if (query.trim().length < 2) {
    return [];
  }
  const users = await User.find({
    _id: { $ne: currentUserId },
    username: {
      $regex: query,
      $options: "i",
    },
  }).select("_id username avatar bio")
    .sort({ username: 1 })
    .limit(20);

  return users;
};

// ==============================
// Update User Avatar
// ==============================
export const updateAvatar = async (
  userId: string,
  fileBuffer: Buffer
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // ==============================
  // Upload To Cloudinary
  // ==============================
  const uploadResult =
    await uploadToCloudinary(fileBuffer);

  // ==============================
  // Update Avatar URL
  // ==============================
  user.avatar =
    uploadResult.secure_url;

  await user.save();

  const updatedUser =
    await User.findById(user._id);

  return updatedUser;
};