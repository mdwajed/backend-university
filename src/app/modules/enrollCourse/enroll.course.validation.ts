import { z } from "zod";

const CreateEnrolledCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: z.string({ required_error: "Offered Course ia required" }),
  }),
});
const UpdateCourseMarksValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    offeredCourse: z.string(),
    student: z.string(),
    courseMarks: z.object({
      classTest1: z.number(),
      midTerm: z.number(),
      classTest2: z.number(),
      finalTerm: z.number(),
    }),
  }),
});

export const EnrolledCourseValidations = {
  CreateEnrolledCourseValidationSchema,
  UpdateCourseMarksValidationSchema,
};
