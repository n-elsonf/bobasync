import { Request, Response } from 'express';
import User from '../models/user';
import { Schema } from 'mongoose';

export class FriendController {
  /**
   * Get all friends of the current user
   */
  static async getFriends(req: Request, res: Response) {
    const user = await User.findById(req.user!._id)
      .populate('friends', 'name email profilePicture');

    res.json({
      success: true,
      data: user?.friends || []
    });
  }

  /**
   * Get all pending friend requests for the current user
   */
  static async getPendingRequests(req: Request, res: Response) {
    const user = await User.findById(req.user!._id)
      .populate('friendRequests.from', 'name email profilePicture');

    const pendingRequests = user?.friendRequests.filter(
      request => request.status === 'pending'
    ) || [];

    res.json({
      success: true,
      data: pendingRequests
    });
  }

  /**
   * Send a friend request to another user
   */
  static async sendRequest(req: Request, res: Response) {
    const { userId } = req.params;
    const targetUser = await User.findById(userId);

    // Add friend request to target user
    targetUser!.friendRequests.push({
      _id: new Schema.Types.ObjectId(),
      from: req.user!._id,
      status: 'pending',
      createdAt: new Date()
    });

    await targetUser!.save();

    res.json({
      success: true,
      message: 'Friend request sent successfully'
    });
  }

  /**
   * Accept a friend request
   */
  static async acceptRequest(req: Request, res: Response) {
    const { requestId } = req.params;
    const user = await User.findById(req.user!._id);
    const request = user!.friendRequestsWithRequestId.get(new Types.ObjectId(requestId));

    // Update request status
    request!.status = 'accepted';

    // Add to friends list (for both users)
    user!.friends.push(request!.from);
    
    // Add current user to the friend's friends list
    await User.findByIdAndUpdate(request!.from, {
      $push: { friends: user!._id }
    });

    await user!.save();

    res.json({
      success: true,
      message: 'Friend request accepted successfully'
    });
  }

  /**
   * Reject a friend request
   */
  static async rejectRequest(req: Request, res: Response) {
    const { requestId } = req.params;
    const user = await User.findById(req.user!._id);
    const request = user!.friendRequestsWithRequestId.get(new Types.ObjectId(requestId));

    request!.status = 'rejected';
    await user!.save();

    res.json({
      success: true,
      message: 'Friend request rejected successfully'
    });
  }

  /**
   * Remove a friend
   */
  static async removeFriend(req: Request, res: Response) {
    const { friendId } = req.params;

    // Remove from both users' friend lists
    await Promise.all([
      User.findByIdAndUpdate(req.user!._id, {
        $pull: { friends: friendId }
      }),
      User.findByIdAndUpdate(friendId, {
        $pull: { friends: req.user!._id }
      })
    ]);

    res.json({
      success: true,
      message: 'Friend removed successfully'
    });
  }
}