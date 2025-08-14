import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { ApiError } from "../../utils/ApiError.js";
import calculatePagination from "../../utils/calculatePagination.js";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model.js";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model.js";
import Course from "../course/course.model.js";
import { Faculty } from "../faculty/faculty.model.js";
import SemesterRegistration from "../semesterRegistration/semesterRegistration.model.js";
import { checkFacultyScheduleConflict } from "./offeredCourse.utils.js";
import { offeredCourseSearchableField } from "./offerredCourse.constant.js";
import { TOfferedCourse } from "./offerredCourse.interface.js";
import OfferedCourse from "./offerredCourse.model.js";

const createOfferedCourse = async (
  payload: TOfferedCourse
): Promise<TOfferedCourse> => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    faculty,
    course,
    section,
    days,
    startTime,
    endTime,
  } = payload;
  // 1. Validate semester registration exists
  const semesterReg = await SemesterRegistration.findById(semesterRegistration);
  if (!semesterReg) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Semester registration not found"
    );
  }
  const academicSemester = semesterReg?.academicSemester;
  // 2. Validate department exists
  const departmentDoc = await AcademicDepartment.findById(academicDepartment);
  if (!departmentDoc) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Department is not found");
  }
  // 3. Validate faculty exists
  const facultyDoc = await AcademicFaculty.findById(academicFaculty);
  if (!facultyDoc) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Faculty is not found");
  }
  //4. Validate department belongs to faculty
  const departmentBelongsToFaculty = await AcademicDepartment.exists({
    _id: academicDepartment,
    academicFaculty,
  });
  if (!departmentBelongsToFaculty) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `${departmentDoc?.name} does not belong to the ${facultyDoc.name}`
    );
  }

  // 5. Optional: Validate course exists (if needed)
  const courseDoc = await Course.findById(course);
  if (!courseDoc) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
  }
  // 6. Check for duplicate offered course (same semester, section, and course)
  const duplicateCourse = await OfferedCourse.findOne({
    semesterRegistration,
    section,
    course,
  });

  if (duplicateCourse) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      `${courseDoc.title} already offered in section ${section} for this semester`
    );
  }

  // 7. Check faculty schedule conflicts
  const hasConflict = await checkFacultyScheduleConflict({
    faculty,
    academicSemester,
    days,
    startTime,
    endTime,
  });

  if (hasConflict) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      `${facultyDoc.name} already has a class during this time on ${days.join(
        ", "
      )},Choose another time`
    );
  }
  // 8. Create offered course
  const offeredCourse = await OfferedCourse.create({
    ...payload,
    academicSemester,
  });
  return offeredCourse;
};
const getAllOfferedCourse = async (query: Record<string, unknown>) => {
  const { page, limit } = calculatePagination({
    page: Number(query.page),
    limit: Number(query.limit),
  });
  const baseQuery = OfferedCourse.find()
    .populate("semesterRegistration")
    .populate("academicSemester")
    .populate("academicFaculty")
    .populate("academicDepartment")
    .populate("course")
    .populate({ path: "faculty", populate: "user" });
  const offeredCourseQuery = new QueryBuilder(baseQuery, query)
    .search(offeredCourseSearchableField)
    .sort()
    .filter()
    .paginate()
    .fields();
  const result = await offeredCourseQuery.modelQuery;
  const total = await OfferedCourse.countDocuments();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleOfferedCourse = async (id: string) => {
  const result = OfferedCourse.findById(id)
    .populate("semesterRegistration")
    .populate("academicSemester")
    .populate("academicFaculty")
    .populate("academicDepartment")
    .populate("course")
    .populate({ path: "faculty", populate: "user" });
  return result;
};

const updateOfferedCourse = async (
  id: string,
  payload: Pick<
    TOfferedCourse,
    "faculty" | "maxCapacity" | "section" | "days" | "startTime" | "endTime"
  >
) => {
  const { faculty, days, startTime, endTime } = payload;

  const offeredCourseDoc = await OfferedCourse.findById(id);
  if (!offeredCourseDoc) {
    throw new ApiError(StatusCodes.CONFLICT, `Offered Course is not found !`);
  }
  const facultyDoc = await Faculty.findById(faculty);
  if (!facultyDoc) {
    throw new ApiError(StatusCodes.CONFLICT, `Faculty is not found !`);
  }
  const academicSemester = offeredCourseDoc.academicSemester;
  const semesterRegistration = offeredCourseDoc.semesterRegistration;

  const semesterRegistrationStatus = await SemesterRegistration.findById(
    semesterRegistration
  );
  if (semesterRegistrationStatus?.status !== "UPCOMING") {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`
    );
  }
  // 7. Check faculty schedule conflicts
  const hasConflict = await checkFacultyScheduleConflict({
    faculty,
    academicSemester,
    days,
    startTime,
    endTime,
  });

  if (hasConflict) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      `${facultyDoc.name} already has a class during this time on ${days.join(
        ", "
      )},Choose another time`
    );
  }
  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteOfferedCourse = async (id: string) => {
  const offeredCourseDoc = await OfferedCourse.findById(id);
  if (!offeredCourseDoc) {
    throw new ApiError(StatusCodes.CONFLICT, `Offered Course is not found !`);
  }

  const semesterRegistrationDoc = offeredCourseDoc?.semesterRegistration;

  const semesterRegistration = await SemesterRegistration.findById(
    semesterRegistrationDoc
  );

  if (semesterRegistration?.status !== "UPCOMING") {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `You can not delete this offered course as it is ${semesterRegistration?.status}`
    );
  }
  const deletedOfferedCourse = await OfferedCourse.findByIdAndDelete(id);
  return deletedOfferedCourse;
};

export const OfferedCourseService = {
  createOfferedCourse,
  getAllOfferedCourse,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
