import { model, Schema } from "mongoose";
import { Grade } from "./enroll.course.constant.js";
import { TCourseMarks, TEnrolledCourse } from "./enroll.course.interface.js";

export const courseMarksSchema = new Schema<TCourseMarks>(
  {
    classTest1: { type: Number, min: 0, max: 10, default: 0 },
    midTerm: { type: Number, min: 0, max: 30, default: 0 },
    classTest2: { type: Number, min: 0, max: 10, default: 0 },
    finalTerm: { type: Number, min: 0, max: 50, default: 0 },
  },
  { _id: false }
);
export const enrolledCourseSchema = new Schema<TEnrolledCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: "SemesterRegistration",
      required: true,
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSemester",
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: "AcademicFaculty",
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: "AcademicDepartment",
      required: true,
    },
    offeredCourse: {
      type: Schema.Types.ObjectId,
      ref: "OfferedCourse",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    grade: { type: String, enum: Grade, default: "N/A" },
    courseMarks: { type: courseMarksSchema, default: {} },
    isEnrolled: { type: Boolean, default: false },
    gradePoints: { type: Number, max: 4, min: 0, default: 0 },
    isCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Document middleware
// userSchema.pre("save", async function (next) {
//   const user = this;
//   user.password = await bcrypt.hash(
//     user.password,
//     Number(config.bcrypt_salt_round)
//   );
//   next();
// });
// userSchema.post("save", function (doc, next) {
//   doc.password = "";
//   next();
// });
export const EnrolledCourse = model<TEnrolledCourse>(
  "EnrolledCourse",
  enrolledCourseSchema
);
