import { z } from "zod";
import { UserStatus } from "./user.constant.js";

const UserValidationSchema = z.object({
  password: z
    .string({
      required_error: "Password is must be string",
    })
    .min(6, { message: "Password must be at least 6 characters long" })
    .optional(),
});
const UserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(UserStatus),
  }),
});

export const UserValidations = {
  UserValidationSchema,
  UserStatusValidationSchema,
};
