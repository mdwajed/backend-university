import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils/ApiError.js";
import invalidObjectId from "../../utils/invalidObjectId.js";
import { TAcademicDepartment } from "./academicDepartment.interface.js";
import { AcademicDepartment } from "./academicDepartment.model.js";

const createAcademicDepartment = async (payload: TAcademicDepartment) => {
  const department = await AcademicDepartment.create(payload);
  return department;
};
const getAllAcademicDepartment = async () => {
  const department = await AcademicDepartment.find().populate(
    "academicFaculty"
  );
  return department;
};
const getSingleAcademicDepartment = async (id: string) => {
  // invalidObjectId(id, "department ID");
  const department = await AcademicDepartment.findById({ id }).populate(
    "academicFaculty"
  );
  // if (!department) {
  //   throw new ApiError(
  //     StatusCodes.NOT_FOUND,
  //     `Department with ID ${id} is not exist`
  //   );
  // }
  return department;
};
const updateAcademicDepartment = async (
  id: string,
  payload: Partial<TAcademicDepartment>
) => {
  invalidObjectId(id, "department ID");
  const department = await AcademicDepartment.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    }
  );
  if (!department) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Department with ID ${id} is not exist`
    );
  }
  return department;
};

export const AcademicDepartmentService = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
