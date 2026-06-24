import bcrypt from "bcrypt";
import User from "./user.model";
import ApiError from "../../utils/ApiError";
import { IUser } from "./auth.types";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

export const registerUser = async (
  payload: RegisterUserInput
): Promise<IUser> => {
  const { username, email, password } = payload;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "User with this email or username already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return createdUser;
};

export const loginUser = async (
  payload: LoginUserInput
): Promise<{
  user: IUser | null;
  accessToken: string;
  refreshToken: string;
}> => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
  });

  user.refreshToken = refreshToken;
  await user.save();

  const safeUser = await User.findById(user._id);

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

export const getCurrentUser = async (
  userId: string
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

// ==============================
// User Logout
// ==============================
export const logoutUser = async (
  userId: string
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.refreshToken = "";

  await user.save();

  return null;
};