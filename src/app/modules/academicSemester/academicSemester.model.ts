import { model, Schema } from "mongoose";
import {
  SemesterCode,
  SemesterMonths,
  SemesterName,
} from "./academicSemester.constant.js";
import { TAcademicSemester } from "./academicSemester.interface.js";

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      required: true,
      enum: SemesterName,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      enum: SemesterCode,
      trim: true,
    },
    academicYear: { type: String, required: true },
    startMonth: {
      type: String,
      enum: SemesterMonths,
      required: true,
      trim: true,
    },
    endMonth: {
      type: String,
      enum: SemesterMonths,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
academicSemesterSchema.index({ name: 1, academicYear: 1 }, { unique: true });

export const AcademicSemester = model<TAcademicSemester>(
  "AcademicSemester",
  academicSemesterSchema
);
