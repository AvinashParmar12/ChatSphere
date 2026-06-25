import { redisClient } from "../../config/redis";

// ==============================
// Set User Online
// ==============================
export const setUserOnline = async (
  userId: string
): Promise<void> => {
  await redisClient.set(
    `online:${userId}`,
    "true"
  );
};

// ==============================
// Set User Offline
// ==============================
export const setUserOffline = async (
  userId: string
): Promise<void> => {
  await redisClient.del(
    `online:${userId}`
  );
};

// ==============================
// Check User Online Status
// ==============================
export const isUserOnline = async (
  userId: string
): Promise<boolean> => {
  const status =
    await redisClient.get(
      `online:${userId}`
    );

  return status === "true";
};

// ==============================
// Get User Status
// ==============================
export const getUserStatus = async (
  userId: string
) => {
  const isOnlineStatus =
    await isUserOnline(userId);

  return {
    isOnline: isOnlineStatus,
  };
};
