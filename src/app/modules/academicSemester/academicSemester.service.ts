import { TAcademicSemester } from "./academicSemester.interface.js";
import { AcademicSemester } from "./academicSemester.model.js";

const createAcademicSemester = async (payload: TAcademicSemester) => {
  const academicSemester = await AcademicSemester.create(payload);
  return academicSemester;
};
const getAllAcademicSemesters = async () => {
  const result = await AcademicSemester.find();
  return result;
};
const getSingleAcademicSemester = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};
const updateAcademicSemester = async (
  id: string,
  payload: Partial<TAcademicSemester>
) => {
  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterService = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
