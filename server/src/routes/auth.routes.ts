import express from "express";
import { AuthController } from "../controller/auth.controller";
import { protect } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { authValidation } from "../validations/auth.validation";

const router = express.Router();

// Public routes
router.post(
  "/register",
  validateRequest(authValidation.register),
  AuthController.register
);

router.post(
  "/login",
  validateRequest(authValidation.login),
  AuthController.login
);

router.post(
  "/google",
  validateRequest(authValidation.googleAuth),
  AuthController.googleAuth
);

router.get("/verify-email/:token", AuthController.verifyEmail);

// router.post(
//   "/forgot-password",
//   validateRequest(authValidation.forgotPassword),
//   AuthController.requestPasswordReset
// );

// router.post(
//   "/reset-password/:token",
//   validateRequest(authValidation.resetPassword),
//   AuthController.resetPassword
// );

// router.post(
//   "/validate-token",
//   validateRequest(authValidation.validateToken),
//   AuthController.validateToken
// );

// Protected routes
router.get("/me", protect, AuthController.getCurrentUser);

export default router;
