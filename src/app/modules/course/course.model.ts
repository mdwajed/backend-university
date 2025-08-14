import { model, Schema } from "mongoose";
import {
  TCourse,
  TCourseFaculty,
  TPrerequisiteCourses,
} from "./course.interface.js";

const preRequisiteCoursesSchema = new Schema<TPrerequisiteCourses>(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Course",
      trim: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { _id: false }
);

const courseSchema = new Schema<TCourse>(
  {
    title: { type: String, required: true, trim: true, unique: true },
    prefix: { type: String, required: true, trim: true },
    code: { type: Number, required: true },
    credits: { type: Number, required: true },
    preRequisiteCourses: [preRequisiteCoursesSchema],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Course = model<TCourse>("Course", courseSchema);

export default Course;

const courseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    unique: true,
    ref: "Course",
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
    },
  ],
});

export const CourseFaculty = model<TCourseFaculty>(
  "CourseFaculty",
  courseFacultySchema
);
