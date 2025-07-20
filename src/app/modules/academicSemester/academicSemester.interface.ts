import {
  TSemesterCode,
  TSemesterMonth,
  TSemesterName,
} from "./academicSemester.constant.js";

export type TAcademicSemester = {
  name: TSemesterName;
  code: TSemesterCode;
  academicYear: string;
  startMonth: TSemesterMonth;
  endMonth: TSemesterMonth;
};
