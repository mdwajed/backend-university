import { QueryWithHelpers, Schema, model } from "mongoose";
import { BloodGroup, Gender } from "./faculty.constant.js";
import { FacultyModel, TFaculty, TUserName } from "./faculty.interface.js";

const userNameSchema = new Schema<TUserName>(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      maxlength: [20, "Name can not be more than 20 characters"],
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last Name is required"],
      maxlength: [20, "Name can not be more than 20 characters"],
    },
  },
  { _id: false }
);

const facultySchema = new Schema<TFaculty, FacultyModel>(
  {
    id: {
      type: String,
      required: [true, "ID is required"],
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User id is required"],
      unique: true,
      ref: "User",
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
    },
    name: {
      type: userNameSchema,
      required: [true, "Name is required"],
    },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message: "{VALUE} is not a valid gender",
      },
      required: [true, "Gender is required"],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      index: true,
    },
    contactNo: { type: String, required: [true, "Contact number is required"] },
    emergencyContactNo: {
      type: String,
      required: [true, "Emergency contact number is required"],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BloodGroup,
        message: "{VALUE} is not a valid blood group",
      },
    },
    presentAddress: {
      type: String,
      required: [true, "Present address is required"],
    },
    permanentAddress: {
      type: String,
      required: [true, "Permanent address is required"],
    },
    profileImage: { type: String },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, "Academic department is required"],
      ref: "AcademicDepartment",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// generating full name
facultySchema.virtual("fullName").get(function (this: TFaculty) {
  if (!this.name) return "";
  const { firstName, middleName, lastName } = this.name;
  return [firstName, middleName, lastName].filter(Boolean).join(" ");
});

// filter out deleted documents
facultySchema.pre(
  /^find/,
  function (
    this: QueryWithHelpers<FacultyModel, Record<string, unknown>>,
    next
  ) {
    this.find({ isDeleted: { $ne: true } });
    next();
  }
);

//checking if user is already exist!
facultySchema.statics.isUserExists = async function (
  this: FacultyModel,
  id: string
): Promise<TFaculty | null> {
  return this.findOne({ id });
};

export const Faculty = model<TFaculty, FacultyModel>("Faculty", facultySchema);
