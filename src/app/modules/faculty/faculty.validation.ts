import { z } from "zod";
import { BloodGroup, Gender } from "./faculty.constant.js";

export const userNameZodSchema = z.object({
  firstName: z
    .string({ required_error: "First Name is required" })
    .max(20, "Name cannot be more than 20 characters")
    .refine((value) => /^[A-Z]/.test(value), {
      message: "First Name must start with a capital letter",
    }),
  middleName: z.string().optional(),
  lastName: z
    .string({ required_error: "Last Name is required" })
    .max(20, "Name cannot be more than 20 characters"),
});

export const createFacultyZodSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    faculty: z.object({
      designation: z.string({ required_error: "Designation is required" }),
      name: userNameZodSchema,
      gender: z.enum([...Gender] as [string, ...string[]], {
        required_error: "Gender is required",
        invalid_type_error: "Invalid gender value",
      }),
      dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
        .optional(),
      email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email format"),
      contactNo: z.string({ required_error: "Contact number is required" }),
      emergencyContactNo: z.string({
        required_error: "Emergency contact number is required",
      }),
      bloodGroup: z
        .enum([...BloodGroup] as [string, ...string[]], {
          invalid_type_error: "Invalid blood group",
        })
        .optional(),
      presentAddress: z.string({
        required_error: "Present address is required",
      }),
      permanentAddress: z.string({
        required_error: "Permanent address is required",
      }),
      profileImg: z.string().optional(),
      academicDepartment: z
        .string({
          required_error: "Academic department is required",
        })
        .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId"),
    }),
  }),
});

export const updateFacultyZodSchema = z.object({
  body: z.object({
    faculty: z
      .object({
        designation: z.string(),
        name: userNameZodSchema.partial(),
        gender: z.enum([...Gender] as [string, ...string[]], {
          invalid_type_error: "Invalid gender",
        }),
        dateOfBirth: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
        email: z.string().email("Invalid email format"),

        contactNo: z
          .string()
          .min(5)
          .regex(/^\+?[0-9]{6,15}$/, "Invalid contact number"),

        emergencyContactNo: z.string().min(5),

        bloodGroup: z
          .enum([...BloodGroup] as [string, ...string[]], {
            invalid_type_error: "Invalid blood group",
          })
          .optional(),

        presentAddress: z.string(),

        permanentAddress: z.string(),

        profileImg: z.string().url("Invalid profile image URL"),

        academicDepartment: z
          .string()
          .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId"),
      })
      .partial(),
  }),
});
export const FacultyZodValidation = {
  createFacultyZodSchema,
  updateFacultyZodSchema,
};
