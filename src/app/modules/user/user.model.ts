import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import config from "../../config/index.js";
import { UserRoles, UserStatus } from "./user.constant.js";
import { TUser } from "./user.interface.js";
export const userSchema = new Schema<TUser>(
  {
    id: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    role: {
      type: String,
      enum: UserRoles,
    },
    status: {
      type: String,
      enum: UserStatus,
      default: "in_progress",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

// Document middleware
userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round)
  );
  next();
});
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});
export const User = model<TUser>("User", userSchema);
