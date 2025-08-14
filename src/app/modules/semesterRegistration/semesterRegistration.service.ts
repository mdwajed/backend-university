import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { ApiError } from "../../utils/ApiError.js";
import calculatePagination from "../../utils/calculatePagination.js";
import OfferedCourse from "../offerredCourse/offerredCourse.model.js";
import { Status } from "./semesterRegistration.constant.js";
import { TSemesterRegistration } from "./semesterRegistration.interface.js";
import SemesterRegistration from "./semesterRegistration.model.js";

const createSemesterRegistration = async (
  payload: TSemesterRegistration
): Promise<TSemesterRegistration> => {
  // is there any semester registered with status upcoming and ongoing
  const ongoingAndUpcomingSemester = await SemesterRegistration.findOne({
    $or: [{ status: Status.ONGOING }, { status: Status.UPCOMING }],
  });

  if (ongoingAndUpcomingSemester) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Already register a semester with status ${ongoingAndUpcomingSemester.status}`
    );
  }

  // is there any semesterRegistration with this academic semester
  const isExist = await SemesterRegistration.findOne({
    academicSemester: payload?.academicSemester,
  });
  if (isExist) {
    throw new ApiError(StatusCodes.CONFLICT, "Semester is already registered!");
  }
  const result = await SemesterRegistration.create(payload);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to create Semester Registration"
    );
  }
  return result;
};
const getAllSemesterRegistration = async (query: Record<string, unknown>) => {
  const { page, limit } = calculatePagination({
    page: Number(query.page),
    limit: Number(query.limit),
  });

  const baseQuery = SemesterRegistration.find().populate("academicSemester");

  const SemesterRegistrationQuery = new QueryBuilder(baseQuery, query)
    .sort()
    .filter()
    .paginate()
    .fields();

  const result = await SemesterRegistrationQuery.modelQuery;

  const total = await SemesterRegistration.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleSemesterRegistration = async (id: string) => {
  const result = await SemesterRegistration.findById(id).populate(
    "academicSemester"
  );
  return result;
};

const updateSemesterRegistration = async (
  id: string,
  payload: Partial<TSemesterRegistration>
) => {
  // 1. Find the semester registration by ID
  const existingSemester = await SemesterRegistration.findById(id);
  // 2. If not found, throw 404 error
  if (!existingSemester) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Semester registration not found"
    );
  }
  // update status UPCOMING > ONGOING > ENDED not reversely

  const currentStatus = existingSemester.status;
  const newStatus = payload?.status;
  if (newStatus && newStatus !== currentStatus) {
    const allowedTransaction: Record<string, string[]> = {
      UPCOMING: [Status.ONGOING, Status.ENDED],
      ONGOING: [Status.ENDED],
      ENDED: [],
    };
    const allowed = allowedTransaction[currentStatus];
    console.log(allowed);
    if (!allowed.includes(newStatus)) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }

  // 4. Update the semester registration
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSemesterRegistration = async (id: string) => {
  const semesterRegistrationDoc = await SemesterRegistration.findById(id);
  // 404 if not found
  if (!semesterRegistrationDoc) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `This semester registration is not found`
    );
  }
  // Only allow delete if status is UPCOMING
  if (semesterRegistrationDoc.status !== Status.UPCOMING) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      `You can not delete this semester registration as it is ${semesterRegistrationDoc.status}`
    );
  }
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Delete offered courses first
      const deletedOfferedCourse = await OfferedCourse.deleteMany(
        { semesterRegistration: id },
        { session }
      );
      if (deletedOfferedCourse.deletedCount === 0) {
        console.warn(
          `No offered courses found for semester registration ${id} — proceeding with deletion`
        );
      }
      // Delete the semester registration itself
      const deletedSemesterRegistration =
        await SemesterRegistration.findByIdAndDelete(id, {
          session,
        });
      if (!deletedSemesterRegistration) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          `Failed to delete semester registration`
        );
      }
    });
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "semester registration and offered course could not be deleted "
    );
  } finally {
    await session.endSession();
  }
};

export const SemesterRegistrationService = {
  getAllSemesterRegistration,
  createSemesterRegistration,
  getSingleSemesterRegistration,
  deleteSemesterRegistration,
  updateSemesterRegistration,
};
