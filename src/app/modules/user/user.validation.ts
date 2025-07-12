import { z } from "zod";

export const UserValidationSchema = z.object({
  password: z
    .string({
      required_error: "Password is must be string",
    })
    .min(6, { message: "Password must be at least 6 characters long" })
    .optional(),
});
