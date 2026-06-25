import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket/socket";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    // Create HTTP Server
    const httpServer = createServer(app);

    // Initialize Socket.IO
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });

    initializeSocket(io);

    // Start Server
    httpServer.listen(env.PORT, () => {
      console.log(
        `Server running on port ${env.PORT}`
      );
    });
  } catch (error) {
    console.error("Server startup failed:", error);
  }
};

startServer();