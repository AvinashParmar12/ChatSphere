import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

// Socket JWT Payload
interface SocketTokenPayload {
  userId: string;
}

// ==============================
// Authenticate Socket Connection
// ==============================
export const authenticateSocket = (
  socket: Socket
): string => {
  // Get token from socket handshake
  const token = socket.handshake.auth.token;

  if (!token) {
    throw new Error("Authentication token is required");
  }

  try {
    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET
    ) as SocketTokenPayload;

    return decoded.userId;
  } catch {
    throw new Error("Invalid or expired token");
  }
};