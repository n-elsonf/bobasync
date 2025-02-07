import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Login user
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Google authentication
  //   static async googleAuth(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { token } = req.body;
  //       const result = await AuthService.googleAuth(token);
  //       res.status(200).json(result);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }

  // Verify email
  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const result = await AuthService.verifyEmail(token);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Request password reset
  static async requestPasswordReset(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;
      const result = await AuthService.requestPasswordReset(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Reset password
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const result = await AuthService.resetPassword(token, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get current user
  static async getCurrentUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      res.status(200).json({ user: user.getPublicProfile() });
    } catch (error) {
      next(error);
    }
  }

  // Validate token
  static async validateToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const result = await AuthService.validateToken(token);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
