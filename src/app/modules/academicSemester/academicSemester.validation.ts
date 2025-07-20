import { z } from "zod";
import {
  SemesterCode,
  SemesterMonths,
  SemesterName,
  SemesterNameCodeMapper,
} from "./academicSemester.constant.js";

const createAcademicSemesterZodSchema = z.object({
  body: z
    .object({
      name: z.enum([...SemesterName] as [string, ...string[]], {
        required_error: "Semester name is required",
        invalid_type_error: "Invalid semester name",
      }),
      code: z.enum([...SemesterCode] as [string, ...string[]], {
        required_error: "Semester code is required",
        invalid_type_error: "Invalid semester code",
      }),
      academicYear: z.string({
        required_error: "Academic year is required",
        invalid_type_error:
          "Academic year must be a string in YYYY-MM-DD format",
      }),

      startMonth: z.enum([...SemesterMonths] as [string, ...string[]], {
        required_error: "Start month is required",
        invalid_type_error: "Invalid start month",
      }),
      endMonth: z.enum([...SemesterMonths] as [string, ...string[]], {
        required_error: "End month is required",
        invalid_type_error: "Invalid end month",
      }),
    })
    .refine(
      (data) =>
        SemesterNameCodeMapper[
          data.name as keyof typeof SemesterNameCodeMapper
        ] === data.code,
      {
        message: "Semester code doesn't match the Semester name",
        path: ["code"],
      }
    ),
});

const updateAcademicSemesterZodSchema = z.object({
  body: z
    .object({
      name: z.enum([...SemesterName] as [string, ...string[]]).optional(),
      code: z.enum([...SemesterCode] as [string, ...string[]]).optional(),
      academicYear: z.string().optional(),
      startMonth: z
        .enum([...SemesterMonths] as [string, ...string[]])
        .optional(),
      endMonth: z.enum([...SemesterMonths] as [string, ...string[]]).optional(),
    })
    .refine(
      (data) =>
        !(data.name && data.code) ||
        SemesterNameCodeMapper[
          data.name as keyof typeof SemesterNameCodeMapper
        ] === data.code,
      {
        message: "Semester code doesn't match the Semester name",
        path: ["code"],
      }
    ),
});

export const academicSemesterZodValidations = {
  createAcademicSemesterZodSchema,
  updateAcademicSemesterZodSchema,
};
