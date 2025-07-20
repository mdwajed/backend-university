import { z } from "zod";

const createAcademicFacultyZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Semester name is required",
      invalid_type_error: "Invalid semester name",
    }),
  }),
});
const updateAcademicFacultyZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Semester name is required",
      invalid_type_error: "Invalid semester name",
    }),
  }),
});

export const academicFacultyZodValidations = {
  createAcademicFacultyZodSchema,
  updateAcademicFacultyZodSchema,
};
