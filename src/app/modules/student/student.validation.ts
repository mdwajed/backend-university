import { z } from "zod";

// --- Utility Regex ---
const phoneRegex = /^(\+?88)?01[3-9]\d{8}$/; // Valid Bangladeshi phone number format
const dateOfBirthRegex = /^\d{4}-\d{2}-\d{2}$/;
// --- Enums ---
const GenderEnum = z.enum(["male", "female"]);

const BloodGroupEnum = z.enum([
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
]);

// --- Sub-schemas ---

const createUserNameZodSchema = z.object({
  firstName: z.string().trim().min(2).max(50),
  middleName: z.string().trim().max(50).optional(),
  lastName: z.string().trim().min(2).max(50).optional(),
});

const createGuardianZodSchema = z.object({
  fatherName: z.string().trim().min(2).max(100),
  fatherOccupation: z.string().trim().min(2).max(100),
  fatherContactNo: z
    .string()
    .regex(phoneRegex, "Invalid Bangladeshi phone number"),
  motherName: z.string().trim().min(2).max(100),
  motherOccupation: z.string().trim().min(2).max(100),
  motherContactNo: z
    .string()
    .regex(phoneRegex, "Invalid Bangladeshi phone number"),
});

const createLocalGuardianZodSchema = z.object({
  name: z.string().trim().min(2).max(100),
  occupation: z.string().trim().min(2).max(100),
  contactNo: z.string().regex(phoneRegex, "Invalid Bangladeshi phone number"),
  address: z.string().min(5),
});

// --- Main Student Schema ---

const createStudentZodSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: createUserNameZodSchema,
      email: z.string().email().max(100),
      gender: GenderEnum,
      dateOfBirth: z
        .string()
        .regex(dateOfBirthRegex, "Invalid date format (YYYY-MM-DD)")
        .optional(),
      contactNo: z
        .string()
        .regex(phoneRegex, "Invalid Bangladeshi phone number"),
      emergencyContactNo: z
        .string()
        .regex(phoneRegex, "Invalid Bangladeshi phone number"),
      BloodGroup: BloodGroupEnum.optional(),
      permanentAddress: z.string().min(5),
      presentAddress: z.string().min(5),
      guardian: createGuardianZodSchema,
      localGuardian: createLocalGuardianZodSchema,
      profileImage: z.string().url().optional(),
      admissionSemester: z.string(),
    }),
  }),
});

const updateStudentZodSchema = z.object({
  body: z.object({
    student: z
      .object({
        name: createUserNameZodSchema.partial(),
        email: z.string().email().max(100).optional(),
        gender: GenderEnum.optional(),
        dateOfBirth: z
          .string()
          .regex(dateOfBirthRegex, "Invalid date format (YYYY-MM-DD)")
          .optional(),
        contactNo: z.string().regex(phoneRegex).optional(),
        emergencyContactNo: z.string().regex(phoneRegex).optional(),
        BloodGroup: BloodGroupEnum.optional(),
        permanentAddress: z.string().min(5).optional(),
        presentAddress: z.string().min(5).optional(),
        guardian: createGuardianZodSchema.partial().optional(),
        localGuardian: createLocalGuardianZodSchema.partial().optional(),
        profileImage: z.string().url().optional(),
        admissionSemester: z.string().optional(),
      })
      .partial(),
  }),
});
export const studentZodValidations = {
  createStudentZodSchema,
  updateStudentZodSchema,
};
