import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import { updateProfile, searchUsers, updateAvatar } from "./user.service";
import ApiError from "../../utils/ApiError";

// ==============================
// Update User Profile
// ==============================
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedUser = await updateProfile(
      req.userId as string,
      req.body
    );

    res.status(200).json(
      new ApiResponse(
        "Profile updated successfully",
        updatedUser
      )
    );
  }
);

// ==============================
// Search Users
// ==============================
export const searchAllUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query.q as string;

    const users = await searchUsers(
      req.userId as string,
      query || ""
    );

    res.status(200).json(
      new ApiResponse(
        "Users fetched successfully",
        users
      )
    );
  }
);

// ==============================
// Update User Avatar
// ==============================
export const updateUserAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(
        400,
        "Avatar image is required"
      );
    }

    const updatedUser =
      await updateAvatar(
        req.userId as string,
        req.file.buffer
      );

    res.status(200).json(
      new ApiResponse(
        "Avatar updated successfully",
        updatedUser
      )
    );
  }
);