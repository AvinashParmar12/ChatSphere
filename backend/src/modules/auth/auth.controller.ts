import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import { registerUser, loginUser, logoutUser } from "./auth.service";
import { getCurrentUser } from "./auth.service";

// ==============================
// User Registration
// ==============================
export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await registerUser(req.body);

    res.status(201).json(
      new ApiResponse(
        "User registered successfully",
        user
      )
    );
  }
);

// ==============================
// User Login
// ==============================
export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await loginUser(req.body);

    res.status(200).json(
      new ApiResponse(
        "Login successful",
        result
      )
    );
  }
);

// ==============================
// Get Current User
// ==============================
export const getMe = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await getCurrentUser(
      req.userId as string
    );

    res.status(200).json(
      new ApiResponse(
        "Current user fetched successfully",
        user
      )
    );
  }
);

// ==============================
// User Logout
// ==============================
export const logout = asyncHandler(
  async (req: Request, res: Response) => {
    await logoutUser(req.userId as string);

    res.status(200).json(
      new ApiResponse(
        "Logout successful",
        null
      )
    );
  }
);