import { TAcademicFaculty } from "./academicFaculty.interface.js";
import { AcademicFaculty } from "./academicFaculty.model.js";

const createAcademicFaculty = async (payload: TAcademicFaculty) => {
  const academicFaculty = await AcademicFaculty.create(payload);
  return academicFaculty;
};
const getAllAcademicFaculty = async () => {
  const result = await AcademicFaculty.find();
  return result;
};
const getSingleAcademicFaculty = async (id: string) => {
  const result = await AcademicFaculty.findById(id);
  return result;
};
const updateAcademicFaculty = async (
  id: string,
  payload: Partial<TAcademicFaculty>
) => {
  const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicFacultyService = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
