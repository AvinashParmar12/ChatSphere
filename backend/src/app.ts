import express from "express";
import cors from "cors";
import { env } from "./config/env";
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import conversationRoutes from "./modules/conversations/conversation.routes";
import messageRoutes from "./modules/messages/message.routes";
import notificationRoutes from "./modules/notifications/notification.routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ==============================
// Swagger Documentation
// ==============================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Check API health
 *     description: Returns the current status of the ChatSphere API.
 *     responses:
 *       200:
 *         description: API is running successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: ChatSphere API Running
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ChatSphere API Running",
  });
});

// ==============================
// Auth Routes
// ==============================
app.use("/api/v1/auth", authRoutes);

// ==============================
// User Routes
// ==============================
app.use("/api/v1/users", userRoutes);

// ==============================
// Conversation Routes
// ==============================
app.use("/api/v1/conversations", conversationRoutes);

// ==============================
// Message Routes
// ==============================
app.use("/api/v1/messages", messageRoutes);

// ==============================
// Notification Routes
// ==============================

app.use("/api/v1/notifications",notificationRoutes);

// ==============================
// Not Found Route
// ==============================
app.use(notFound);

// ==============================
// Error Handler Middleware
app.use(errorHandler);

export default app;