import { z } from "zod";
import { BloodGroup, Gender } from "./admin.constant.js";

export const userNameZodSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
});

const createAdminZodSchema = z.object({
  body: z.object({
    password: z.string().min(8),
    admin: z.object({
      designation: z.string().min(1),
      name: userNameZodSchema,
      gender: z.enum(Gender),
      dateOfBirth: z.coerce.date().optional(),
      email: z.string().email(),
      contactNo: z.string().min(1),
      emergencyContactNo: z.string().min(1),
      bloodGroup: z.enum(BloodGroup).optional(),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      profileImg: z.string().url().optional(),
      isDeleted: z.boolean(),
    }),
  }),
});

const updateAdminZodSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    admin: z
      .object({
        designation: z.string().min(1),
        name: userNameZodSchema.partial(),
        gender: z.enum(Gender),
        dateOfBirth: z.coerce.date().optional(),
        email: z.string().email(),
        contactNo: z.string().min(1),
        emergencyContactNo: z.string().min(1),
        bloodGroup: z.enum(BloodGroup).optional(),
        presentAddress: z.string().min(1),
        permanentAddress: z.string().min(1),
        profileImg: z.string().url().optional(),
        isDeleted: z.boolean(),
      })
      .partial(),
  }),
});

export const adminZodValidations = {
  createAdminZodSchema,
  updateAdminZodSchema,
};
