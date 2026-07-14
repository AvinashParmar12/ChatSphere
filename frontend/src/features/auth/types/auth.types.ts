export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface CurrentUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}