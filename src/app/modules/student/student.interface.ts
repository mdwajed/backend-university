import { Model, Types } from "mongoose";

export type UserName = {
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
};
export type Guardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};
export type LocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};
export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: UserName;
  email: string;
  gender: "male" | "female";
  dateOfBirth?: string;
  contactNo: string;
  emergencyContactNo: string;
  BloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  permanentAddress: string;
  presentAddress: string;
  guardian: Guardian;
  localGuardian: LocalGuardian;
  profileImage?: string;
  isDeleted: boolean;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
};

export interface StudentModel extends Model<TStudent> {
  isUserExist(email: string): Promise<TStudent | null>;
}
