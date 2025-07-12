import { z } from "zod";

// --- Utility Regex ---
const phoneRegex = /^(\+?88)?01[3-9]\d{8}$/; // Valid Bangladeshi phone number format
const birthDayRegex = /^\d{4}-\d{2}-\d{2}$/;
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
  firstName: z.string().min(2).max(50),
  middleName: z.string().max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
});

const createGuardianZodSchema = z.object({
  fatherName: z.string().min(2).max(100),
  fatherOccupation: z.string().min(2).max(100),
  fatherContactNo: z
    .string()
    .regex(phoneRegex, "Invalid Bangladeshi phone number"),
  motherName: z.string().min(2).max(100),
  motherOccupation: z.string().min(2).max(100),
  motherContactNo: z
    .string()
    .regex(phoneRegex, "Invalid Bangladeshi phone number"),
});

const createLocalGuardianZodSchema = z.object({
  name: z.string().min(2).max(100),
  occupation: z.string().min(2).max(100),
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
        .regex(birthDayRegex, "Invalid Birthday Format")
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
    }),
  }),
});

export default createStudentZodSchema;
