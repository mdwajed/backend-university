import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { ApiError } from "../../utils/ApiError.js";
import { TCourse } from "../course/course.interface.js";
import { Faculty } from "../faculty/faculty.model.js";
import OfferedCourse from "../offerredCourse/offerredCourse.model.js";
import SemesterRegistration from "../semesterRegistration/semesterRegistration.model.js";
import { Student } from "../student/student.model.js";
import { TEnrolledCourse } from "./enroll.course.interface.js";
import { EnrolledCourse } from "./enroll.course.model.js";
import { calculateGradeAndGradePoints } from "./enroll.course.utils.js";

const createEnrolledCourse = async (
  userId: string,
  payload: TEnrolledCourse
) => {
  const { offeredCourse } = payload;

  // 1. Find student
  const student = await Student.findOne({ id: userId }, { _id: 1 });

  if (!student) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Student is not found");
  }

  const session = await mongoose.startSession();
  let enrollCourse;
  try {
    await session.withTransaction(async () => {
      // 2. Find offered course
      const offered = await OfferedCourse.findById(offeredCourse)
        .populate<{ course: TCourse }>("course")
        .session(session);
      if (!offered) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Offered Course is not found"
        );
      }

      // 3. Check available seats
      if (offered.maxCapacity <= 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No seats available");
      }
      // const course = await Course.findById(offered.course);
      // check totalCredit exceed maxCredit
      const semesterRegistration = await SemesterRegistration.findById(
        offered.semesterRegistration
      ).select("maxCredit");

      if (!semesterRegistration) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Semester Registration not found"
        );
      }

      // Aggregate current total credits
      const enrolledCourses = await EnrolledCourse.aggregate([
        {
          $match: {
            semesterRegistration: offered.semesterRegistration,
            student: student._id,
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "course",
            foreignField: "_id",
            as: "enrolledCoursesData",
          },
        },
        {
          $unwind: "$enrolledCoursesData",
        },
        {
          $group: {
            _id: null,
            totalEnrolledCoursesCredit: {
              $sum: "$enrolledCoursesData.credits",
            },
          },
        },
        {
          $project: { _id: 0, totalEnrolledCoursesCredit: 1 },
        },
      ]).session(session);

      const currentCredits =
        enrolledCourses.length > 0
          ? enrolledCourses[0].totalEnrolledCoursesCredit
          : 0;
      const newCredits = offered.course?.credits;
      const maxCredit = semesterRegistration.maxCredit;
      if (currentCredits + newCredits > maxCredit) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "You have exceeded max credit limit"
        );
      }

      // 4. Prevent duplicate enrollment
      const alreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: offered.semesterRegistration,
        offeredCourse,
        student: student._id,
      }).session(session);

      if (alreadyEnrolled) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          "This Student is already enrolled in this course"
        );
      }
      // 5. Decrement capacity
      const updatedOffered = await OfferedCourse.findOneAndUpdate(
        { _id: offeredCourse, maxCapacity: { $gt: 0 } },
        { $inc: { maxCapacity: -1 } },
        { new: true, session }
      );
      if (!updatedOffered) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No seats available");
      }

      // 7. Enroll student

      const [created] = await EnrolledCourse.create(
        [
          {
            semesterRegistration: offered.semesterRegistration,
            academicSemester: offered.academicSemester,
            academicFaculty: offered.academicFaculty,
            academicDepartment: offered.academicDepartment,
            offeredCourse,
            course: offered.course,
            student: student._id,
            faculty: offered.faculty,
            isEnrolled: true,
          },
        ],

        { session }
      );
      if (!created) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to enroll student");
      }

      //  Populate before returning
      enrollCourse = await EnrolledCourse.findById(created._id)
        .populate("course")
        .populate("faculty")
        .populate("student")
        .populate("offeredCourse")
        .populate("academicSemester")
        .populate("academicFaculty")
        .populate("academicDepartment")
        .session(session);
    });
    return enrollCourse;
  } catch (error) {
    console.error("Failed to enroll student", error);
    throw error;
  } finally {
    await session.endSession();
  }
};
const updateEnrolledCourseMarks = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>
) => {
  const { offeredCourse, semesterRegistration, student, courseMarks } = payload;

  // 1. Find semester registration
  const semesterRegistrationExists = await SemesterRegistration.findById(
    semesterRegistration
  );
  if (!semesterRegistrationExists) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Semester Registration not found"
    );
  }

  // 2. Find offered course
  const offeredCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!offeredCourseExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Offered Course not found");
  }

  // 3. Find student
  const studentExists = await Student.findById(student);
  if (!studentExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Student not found");
  }

  // 3. Find faculty belong to enrolled course
  const facultyExists = await Faculty.findOne({ id: facultyId }, { _id: 1 });
  if (!facultyExists) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Faculty not found");
  }

  // 2. Find enrolled course belong to faculty
  const enrolledCourseBelongToFaculty = await EnrolledCourse.findOne({
    offeredCourse,
    semesterRegistration,
    student,
    faculty: facultyExists._id,
  });
  // console.log(enrolledCourseBelongToFaculty);
  if (!enrolledCourseBelongToFaculty) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You are not authorise to update course marks"
    );
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };
  if (courseMarks?.finalTerm) {
    const { classTest1, midTerm, classTest2, finalTerm } =
      enrolledCourseBelongToFaculty.courseMarks;
    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5);

    const result = calculateGradeAndGradePoints(totalMarks);

    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;

    console.log(result, totalMarks);
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    enrolledCourseBelongToFaculty._id,
    modifiedData,
    { new: true }
  );
  return result;
};

export const EnrolledCourseService = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
};
