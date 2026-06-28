import express from "express";
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import conversationRoutes from "./modules/conversations/conversation.routes";

const app = express();

app.use(express.json());

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

// Must be AFTER all routes
app.use(notFound);

// Must be LAST
app.use(errorHandler);

export default app;