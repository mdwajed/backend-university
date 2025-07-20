import { z } from "zod";

const createAcademicDepartmentZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Department name is required",
      invalid_type_error: "semester name must be string",
    }),
  }),
  academicFaculty: z.string({
    required_error: "Faculty name is required",
    invalid_type_error: "Faculty name must be string",
  }),
});
const updateAcademicDepartmentZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Department name is required",
      invalid_type_error: "Department name must be string",
    }),
  }),
  academicFaculty: z.string({
    required_error: "Faculty name is required",
    invalid_type_error: "Faculty name must be string",
  }),
});

export const academicDepartmentZodValidations = {
  createAcademicDepartmentZodSchema,
  updateAcademicDepartmentZodSchema,
};
