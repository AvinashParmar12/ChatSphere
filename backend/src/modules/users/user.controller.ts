import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import { updateProfile, searchUsers } from "./user.service";

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