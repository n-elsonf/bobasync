// server/src/app.ts
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middleware/error.middleware";
import { dbConfig } from "./config/database";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling
app.use(errorHandler);

// Database connection
mongoose
  .connect(dbConfig.url)
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error("Database connection error:", error));

export default app;
