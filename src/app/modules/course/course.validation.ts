import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;

const prerequisiteCourseSchema = z.object({
  course: z.string().regex(objectIdRegex, {
    message: "Invalid course ObjectId in prerequisites",
  }),
  isDeleted: z.boolean().optional(),
});

const createCourseZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Course title is required" }),
    prefix: z
      .string({ required_error: "Course prefix is required" })
      .regex(/^[A-Z]{2,10}$/, {
        message: "Prefix must be 2–5 uppercase letters (e.g., CSE, EEE)",
      }),
    code: z
      .number({ required_error: "Course code is required" })
      .int("Course code must be an integer"),
    credits: z
      .number({ required_error: "Credits are required" })
      .positive("Credits must be a positive number"),
    preRequisiteCourses: z
      .array(prerequisiteCourseSchema)
      .optional()
      .default([]),
  }),
});
const updateCourseZodSchema = z.object({
  body: z
    .object({
      title: z.string(),
      prefix: z.string().regex(/^[A-Z]{2,10}$/, {
        message: "Prefix must be 2–5 uppercase letters (e.g., CSE, EEE)",
      }),
      code: z.number().int("Course code must be an integer"),
      credits: z.number().positive("Credits must be a positive number"),
      preRequisiteCourses: z.array(prerequisiteCourseSchema).optional(),
      isDeleted: z.boolean().optional(),
    })
    .partial(),
});

const courseFacultyZodSchema = z.object({
  body: z.object({
    faculties: z
      .array(
        z.string().regex(objectIdRegex, {
          message: "Invalid faculty ObjectId",
        })
      )
      .optional(),
  }),
});
export const courseValidations = {
  createCourseZodSchema,
  updateCourseZodSchema,
  courseFacultyZodSchema,
};
