import { model, Schema } from "mongoose";
import { SemesterStatus } from "./semesterRegistration.constant.js";
import { TSemesterRegistration } from "./semesterRegistration.interface.js";

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "AcademicSemester",
    },
    status: {
      type: String,
      enum: SemesterStatus,
      trim: true,
      default: "UPCOMING",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    minCredit: { type: Number, default: 3 },
    maxCredit: { type: Number, default: 6 },
  },
  { timestamps: true }
);

const SemesterRegistration = model<TSemesterRegistration>(
  "SemesterRegistration",
  semesterRegistrationSchema
);

export default SemesterRegistration;
