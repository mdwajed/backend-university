import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { ApiError } from "../../utils/ApiError.js";
import calculatePagination from "../../utils/calculatePagination.js";
import { courseSearchableField } from "./course.constant.js";
import { TCourse, TCourseFaculty } from "./course.interface.js";
import Course, { CourseFaculty } from "./course.model.js";

const createCourse = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};
const getAllCourses = async (query: Record<string, unknown>) => {
  const { page, limit } = calculatePagination({
    page: Number(query.page),
    limit: Number(query.limit),
  });
  const baseQuery = Course.find().populate({
    path: "preRequisiteCourses.course",
    populate: {
      path: "preRequisiteCourses.course",
      populate: {
        path: "preRequisiteCourses.course",
        populate: {
          path: "preRequisiteCourses.course",
        },
      },
    },
  });
  const courseQuery = new QueryBuilder(baseQuery, query)
    .search(courseSearchableField)
    .sort()
    .filter()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;

  const total = await Course.countDocuments();
  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getSingleCourse = async (id: string) => {
  const result = await Course.findById(id).populate({
    path: "preRequisiteCourses.course",
  });
  return result;
};

const updateCourse = async (
  id: string,
  payload: Partial<TCourse>
): Promise<TCourse> => {
  const { preRequisiteCourses, ...remainingCourseData } = payload;

  const session = await mongoose.startSession();
  try {
    let result: TCourse | null = null;
    await session.withTransaction(async () => {
      const updateBasicCourse = await Course.findByIdAndUpdate(
        id,
        remainingCourseData,
        {
          new: true,
          runValidators: true,
          session,
        }
      );
      if (!updateBasicCourse) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Failed to update basic Course"
        );
      }
      if (!preRequisiteCourses?.length) return;
      // delete Requisite course
      const toDelete = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);
      if (toDelete.length > 0) {
        const deleteResult = await Course.findByIdAndUpdate(
          id,
          {
            $pull: { preRequisiteCourses: { course: { $in: toDelete } } },
          },
          { new: true, runValidators: true, session }
        );
        if (!deleteResult) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Failed to delete prerequisite Course"
          );
        }
      }
      // add Requisite course
      const toAdd = preRequisiteCourses.filter(
        (el) => el.course && !el.isDeleted
      );
      if (toAdd.length > 0) {
        const addResult = await Course.findByIdAndUpdate(
          id,
          {
            $addToSet: {
              preRequisiteCourses: { $each: toAdd },
            },
          },
          { new: true, runValidators: true, session }
        );
        if (!addResult) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Failed to add prerequisite Course"
          );
        }
      }

      result = await Course.findById(id)
        .populate("preRequisiteCourses.course")
        .session(session);
    });
    if (!result) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Course not found after update"
      );
    }

    return result;
  } catch (error) {
    console.error("Failed to update Course:", error);
    throw error;
  } finally {
    await session.endSession();
  }
};

const deleteCourse = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    }
  );
  return result;
};
const assignCourseFaculty = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    }
  );
  return result;
};
const removeCourseFaculty = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    }
  );
  return result;
};

export const CourseService = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignCourseFaculty,
  removeCourseFaculty,
};
