import { Types } from "mongoose";
import { TGrade } from "./enroll.course.constant.js";

export type TCourseMarks = {
  classTest1: number;
  midTerm: number;
  classTest2: number;
  finalTerm: number;
};
export type TEnrolledCourse = {
  semesterRegistration: Types.ObjectId;
  academicSemester: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  offeredCourse: Types.ObjectId;
  course: Types.ObjectId;
  student: Types.ObjectId;
  faculty: Types.ObjectId;
  grade: TGrade;
  courseMarks: TCourseMarks;
  isEnrolled: boolean;
  gradePoints: number;
  isCompleted: boolean;
};
