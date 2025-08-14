import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder.js";
import calculatePagination from "../../utils/calculatePagination.js";
import { FacultySearchableFields } from "./faculty.constant.js";
import { TFaculty } from "./faculty.interface.js";

import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../user/user.model.js";
import { Faculty } from "./faculty.model.js";

export const getAllFaculty = async (query: Record<string, unknown>) => {
  const { page, limit } = calculatePagination({
    page: Number(query.page),
    limit: Number(query.limit),
  });
  const baseQuery = Faculty.find().populate({
    path: "academicDepartment",
    populate: {
      path: "academicFaculty",
    },
  });

  const FacultyQueryBuilder = new QueryBuilder(baseQuery, query)
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await FacultyQueryBuilder.modelQuery;

  const total = await Faculty.countDocuments();

  return {
    meta: { page, limit, total },
    data: result,
  };
};

export const getFacultyById = async (id: string) => {
  const result = await Faculty.findById(id).populate({
    path: "academicDepartment",
    populate: {
      path: "academicFaculty",
    },
  });
  return result;
};

const updateFaculty = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingFacultyData } = payload;

  const remainingUpdatedFacultyData: Record<string, unknown> = {
    ...remainingFacultyData,
  };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      remainingUpdatedFacultyData[`name.${key}`] = value;
    }
  }
  const result = await Faculty.findByIdAndUpdate(
    id,
    remainingUpdatedFacultyData,
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

const deleteFaculty = async (id: string): Promise<TFaculty | null> => {
  const session = await mongoose.startSession();
  let result: TFaculty | null = null;
  try {
    await session.withTransaction(async () => {
      const deletedFaculty = await Faculty.findByIdAndUpdate(
        id,
        { isDeleted: true, updatedAt: new Date() },
        { new: true, session }
      );
      if (!deletedFaculty) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete faculty");
      }
      const userId = deletedFaculty.user;

      const deletedUser = await User.findByIdAndUpdate(
        userId,
        { isDeleted: true },
        { new: true, session }
      );
      if (!deletedUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete user");
      }
      result = deletedFaculty;
    });
    return result;
  } catch (error) {
    console.error("Error deleting faculty:", error);
    throw error;
  } finally {
    await session.endSession();
  }
};
export const FacultyService = {
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};
