import { Types } from "mongoose";
import { TSemesterStatus } from "./semesterRegistration.constant.js";

export type TSemesterRegistration = {
  academicSemester: Types.ObjectId;
  status: TSemesterStatus;
  startDate: Date;
  endDate: Date;
  minCredit: number;
  maxCredit: number;
};
