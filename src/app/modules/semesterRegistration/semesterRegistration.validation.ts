import { z } from "zod";
import { SemesterStatus } from "./semesterRegistration.constant.js";

const objectIdRegex = /^[a-f\d]{24}$/i;
const semesterStatusEnum = z.enum([...SemesterStatus] as [string, ...string[]]);
const createSemesterRegistrationZodSchema = z.object({
  body: z.object({
    academicSemester: z.string().regex(objectIdRegex, {
      message: "Invalid Academic Semester ID",
    }),
    status: semesterStatusEnum.default("UPCOMING"),
    startDate: z
      .string({ required_error: "Start date is required" })
      .datetime(),
    endDate: z.string({ required_error: "End date is required" }).datetime(),
    minCredit: z
      .number()
      .min(3, { message: "Minimum credit must be at least 3" })
      .default(3),
    maxCredit: z
      .number()
      .max(15, { message: "Maximum credit must be at most 15" })
      .default(15),
  }),
});
const updateSemesterRegistrationZodSchema = z.object({
  body: z
    .object({
      academicSemester: z.string().regex(objectIdRegex, {
        message: "Invalid Academic Semester ID",
      }),
      status: semesterStatusEnum,
      startDate: z
        .string({ required_error: "Start date is required" })
        .datetime(),
      endDate: z.string({ required_error: "End date is required" }).datetime(),
      minCredit: z
        .number()
        .min(3, { message: "Minimum credit must be at least 3" }),
      maxCredit: z
        .number()
        .max(15, { message: "Maximum credit must be at most 15" }),
    })
    .partial(),
});

export const SemesterRegistrationValidations = {
  createSemesterRegistrationZodSchema,
  updateSemesterRegistrationZodSchema,
};
