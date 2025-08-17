import { z } from "zod";

const AuthValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: "Id is required" }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, { message: "Password must be at least 6 characters long" }),
  }),
});
const ChangePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old Password is required",
    }),
    newPassword: z.string({
      required_error: "New Password is required",
    }),
  }),
});
const RefreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh Token is required",
    }),
  }),
});
const ForgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: "User Id is required",
    }),
  }),
});
const ResetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: "User Id is required",
    }),
    newPassword: z.string({
      required_error: "New password is required",
    }),
  }),
});

export const AuthValidations = {
  AuthValidationSchema,
  ChangePasswordValidationSchema,
  RefreshTokenValidationSchema,
  ForgetPasswordValidationSchema,
  ResetPasswordValidationSchema,
};
