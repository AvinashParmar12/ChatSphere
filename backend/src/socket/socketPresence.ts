import { redisClient } from "../config/redis";

// ==============================
// Save User ↔ Socket Mapping
// ==============================

export const saveSocketConnection = async (
  userId: string,
  socketId: string
): Promise<void> => {
  await redisClient.set(
    `socket:${userId}`,
    socketId
  );

  await redisClient.set(
    `user:${socketId}`,
    userId
  );
};

// ==============================
// Remove User ↔ Socket Mapping
// ==============================

export const removeSocketConnection = async (
  socketId: string
): Promise<void> => {
  const userId = await redisClient.get(
    `user:${socketId}`
  );

  if (!userId) return;

  await redisClient.del(
    `socket:${userId}`
  );

  await redisClient.del(
    `user:${socketId}`
  );
};

// ==============================
// Get Socket ID By User ID
// ==============================

export const getSocketId = async (
  userId: string
): Promise<string | null> => {
  return await redisClient.get(
    `socket:${userId}`
  );
};

// ==============================
// Get User ID By Socket ID
// ==============================

export const getUserId = async (
  socketId: string
): Promise<string | null> => {
  return await redisClient.get(
    `user:${socketId}`
  );
};