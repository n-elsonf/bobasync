import express from "express";
import { FriendController } from "../controller/friends.controller";
import { protect } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { friendValidation } from "../validations/friends.validation";

const router = express.Router();

// All routes are protected
router.use(protect);

// Get friend lists
router.get("/friends", FriendController.getFriends);
router.get("/requests", FriendController.getPendingRequests);

// Friend request operations
router.post(
  "/requests/:userId",
  validateRequest(friendValidation.sendRequest),
  FriendController.sendRequest
);

router.put(
  "/requests/:requestId/accept",
  validateRequest(friendValidation.handleRequest),
  FriendController.acceptRequest
);

router.put(
  "/requests/:requestId/reject",
  validateRequest(friendValidation.handleRequest),
  FriendController.rejectRequest
);

// Friend removal
router.delete(
  "/friends/:friendId",
  validateRequest(friendValidation.removeFriend),
  FriendController.removeFriend
);

export default router;