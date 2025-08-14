import { Types } from "mongoose";
import { TDays } from "./offerredCourse.constant.js";

export type TOfferedCourse = {
  semesterRegistration: Types.ObjectId;
  academicSemester?: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  maxCapacity: number;
  section: number;
  days: TDays[];
  startTime: string;
  endTime: string;
};

export type TFacultyScheduleConflict = {
  academicSemester?: Types.ObjectId;
  faculty: Types.ObjectId;
  days: TDays[];
  startTime: string;
  endTime: string;
};
