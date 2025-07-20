import { TAcademicSemester } from "../academicSemester/academicSemester.interface.js";
import { User } from "./user.model.js";

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: "student",
    },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};
export const generateStudentId = async (payload: TAcademicSemester) => {
  let initialId = (0).toString();
  const lastStudentId = await findLastStudentId();

  const lastStudentSemesterYear = lastStudentId?.substring(0, 4);

  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);

  const currentStudentSemesterYear = payload.academicYear;

  const currentStudentSemesterCode = payload.code;

  if (
    lastStudentId &&
    lastStudentSemesterYear === currentStudentSemesterYear &&
    lastStudentSemesterCode === currentStudentSemesterCode
  ) {
    initialId = lastStudentId.substring(6);
  }

  const currentId = (Number(initialId) + 1).toString().padStart(4, "0");

  const incrementId = `${payload.academicYear}${payload.code}${currentId}`;

  return incrementId;
};
