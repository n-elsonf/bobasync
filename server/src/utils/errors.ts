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

/**
 * @class ValidationError
 * for 400 status code
 **/
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

/**
 * @class AuthenticationError
 * for 401 status code
 */
export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

/**
 * @class ForbiddenError
 * for 403 status code
 */
export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}

/**
 * @class NotFoundError
 * for 404 status code
 */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

/**
 * @class ConflictError
 * for 409 status code
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

/**
 * @class TooManyRequestsError
 * for 429 status code
 */
export class TooManyRequestsError extends AppError {
  constructor(message: string) {
    super(message, 429);
  }
}

// Error handler middleware
// import { Response } from "express";

// export const errorHandler = (
//   err: Error,
//   // _: Request,
//   res: Response
//   // _: NextFunction
// ) => {
//   if (err instanceof AppError) {
//     return res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//       ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
//     });
//   }

//   // MongoDB duplicate key error
//   if (err.name === "MongoError" && (err as any).code === 11000) {
//     const field = Object.keys((err as any).keyValue)[0];
//     return res.status(409).json({
//       status: "fail",
//       message: `${field} already exists`,
//     });
//   }

//   // MongoDB validation error
//   if (err.name === "ValidationError") {
//     const errors = Object.values((err as any).errors).map(
//       (err: any) => err.message
//     );
//     return res.status(400).json({
//       status: "fail",
//       message: errors.join(", "),
//     });
//   }

//   // JWT errors
//   if (err.name === "JsonWebTokenError") {
//     return res.status(401).json({
//       status: "fail",
//       message: "Invalid token",
//     });
//   }

//   if (err.name === "TokenExpiredError") {
//     return res.status(401).json({
//       status: "fail",
//       message: "Token expired",
//     });
//   }

//   // Default error
//   console.error("Error:", err);
//   res.status(500).json({
//     status: "error",
//     message:
//       process.env.NODE_ENV === "development"
//         ? err.message
//         : "Something went wrong!",
//   });
// };
