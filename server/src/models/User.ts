// src/models/User.ts
import mongoose, { ObjectId, Schema} from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, IUserMethods, IUserModel, PublicUser } from "./types";

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid email address!`,
      },
      index: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined values to be unique
      index: true,
    },
    profilePicture: {
      type: String,
      default: "default-avatar.png",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: {
      type: Date,
      default: null,
    },
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    
    friendRequests: [{
      from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],

    blockedUsers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      sparse: true
    }]
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.post('find', function(docs) {
  // Handle both single doc and array of docs
  const documents = Array.isArray(docs) ? docs : [docs];
  
  documents.forEach(doc => {
    if (doc && doc.friendRequests) {
      // Initialize maps
      doc.friendRequestsWithRequestId = new Map(
        doc.friendRequests.map(request => [request._id, request])
      );
      doc.friendRequestsWithSenderId = new Map(
        doc.friendRequests.map(request => [request.from, request])
      );
    }
  });
});
// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only hash password if it has been modified
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// Method to get public profile (exclude sensitive data)
userSchema.methods.getPublicProfile = function (): PublicUser {
  const userObject = this.toObject();
  // Remove sensitive fields
  const {
    password,
    verificationToken,
    resetPasswordToken,
    resetPasswordExpire,
    blockedUsers,
    ...publicData
  } = userObject;

  return publicData;
};

// Add friend-related methods
userSchema.methods.sendFriendRequest = async function(friendId: string | ObjectId) {
  const friendObjectId = typeof friendId === 'string' ? new Schema.Types.ObjectId(friendId) : friendId;
  // Check if already friends
  if (this.friends.includes(friendObjectId)) {
    throw new Error('Already friends with this user');
  }

  // Check if blocked
  if (this.blockedUsers.includes(friendObjectId) || 
      (await User.findById(friendId))?.blockedUsers.includes(this._id)) {
    throw new Error('Unable to send friend request');
  }

  // Check for existing requests
  const targetUser = await User.findById(friendId);
  if (!targetUser) {
    throw new Error('User not found');
  }

  const existingRequest = targetUser.friendRequestsWithSenderId.get(this._id);
  if (existingRequest) {
    throw new Error('Friend request already sent');
  }

  // Send friend request
  await User.findByIdAndUpdate(friendId, {
    $push: {
      friendRequests: {
        from: this._id,
        status: 'pending'
      }
    }
  });
};

userSchema.methods.acceptFriendRequest = async function(requestId: string | ObjectId) {
  const requestObjectId = typeof requestId === 'string' ? new Schema.Types.ObjectId(requestId) : requestId;
  const request = this.friendRequestsWithRequestId.get(requestObjectId);
  if (!request || request.status !== 'pending') {
    throw new Error('Invalid friend request');
  }

  // Update request status
  request.status = 'accepted';
  
  // Add to friends list for both users
  this.friends.push(request.from);
  await User.findByIdAndUpdate(request.from, {
    $push: { friends: this._id }
  });

  await this.save();
};

userSchema.methods.rejectFriendRequest = async function(requestId: string | ObjectId) {
  const requestObjectId = typeof requestId === 'string' ? new Schema.Types.ObjectId(requestId) : requestId;
  const request = this.friendRequestsWithRequestId.get(requestObjectId);
  if (!request || request.status !== 'pending') {
    throw new Error('Invalid friend request');
  }

  request.status = 'rejected';
  await this.save();
};

userSchema.methods.removeFriend = async function(friendId: string | ObjectId) {
  const friendObjectId = typeof friendId === 'string' ? new Schema.Types.ObjectId(friendId) : friendId;
  if (!this.friends.includes(friendObjectId)) {
    throw new Error('User is not a friend');
  }

  // Remove from both users' friend lists
  this.friends = this.friends.filter(id => id.toString() !== friendId.toString());
  await User.findByIdAndUpdate(friendId, {
    $pull: { friends: this._id }
  });

  await this.save();
};


// Static method to find user by email
userSchema.static("findByEmail", async function findByEmail(email: string) {
  return this.findOne({ email });
});

// Virtual for full name
userSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.name}`;
});

// Create the model
const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
