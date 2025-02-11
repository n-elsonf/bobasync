export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string) {
    super(message, 429);
  }
}

// Error handler middleware
import { Response } from "express";

export const errorHandler = (
  err: Error,
  // _: Request,
  res: Response
  // _: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // MongoDB duplicate key error
  if (err.name === "MongoError" && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    return res.status(409).json({
      status: "fail",
      message: `${field} already exists`,
    });
  }

  // MongoDB validation error
  if (err.name === "ValidationError") {
    const errors = Object.values((err as any).errors).map(
      (err: any) => err.message
    );
    return res.status(400).json({
      status: "fail",
      message: errors.join(", "),
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "fail",
      message: "Token expired",
    });
  }

  // Default error
  console.error("Error:", err);
  res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong!",
  });
};

// Usage example:
/*
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (!user.isVerified) {
      throw new ForbiddenError('Please verify your email first');
    }
  } catch (error) {
    // Will be caught by error handler middleware
    next(error);
  }
  */
