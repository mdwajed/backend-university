import { model, QueryWithHelpers, Schema } from "mongoose";
import { BloodGroup, Gender } from "./admin.constant.js";
import { AdminModel, TAdmin, TUserName } from "./admin.interface.js";

export const userNameSchema = new Schema<TUserName>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, "Last name can not be more than 20 characters"],
    },
    middleName: { type: String, trim: true },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [20, "Last name can not be more than 20 characters"],
    },
  },
  { _id: false }
);

export const adminSchema = new Schema<TAdmin, AdminModel>(
  {
    id: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    designation: { type: String, required: true },
    name: { type: userNameSchema, required: true },
    gender: { type: String, enum: Gender, required: true },
    dateOfBirth: { type: Date },
    email: { type: String, required: true, unique: true },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: { type: String, enum: BloodGroup },
    presentAddress: { type: String, required: true, trim: true },
    permanentAddress: { type: String, required: true, trim: true },
    profileImg: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
adminSchema.virtual("fullName").get(function (this: TAdmin) {
  if (!this.name) return "";
  const { firstName, middleName, lastName } = this.name;
  return [firstName, middleName, lastName].filter(Boolean).join(" ");
});

// Middleware: filter out deleted on find
adminSchema.pre(
  /^find/,
  function (this: QueryWithHelpers<TAdmin, Record<string, unknown>>, next) {
    this.find({ isDeleted: { $ne: true } });
    next();
  }
);

adminSchema.statics.isUserExists = async function (
  this: AdminModel,
  id: string
): Promise<TAdmin | null> {
  return this.findOne({ id });
};
export const Admin = model<TAdmin, AdminModel>("Admin", adminSchema);
