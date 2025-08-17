import express from "express";
import auth from "../../../middlewares/auth.js";
import validateRequest from "../../../middlewares/validateRequest.js";
import { AuthController } from "./auth.controller.js";
import { AuthValidations } from "./auth.validation.js";
const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidations.AuthValidationSchema),
  AuthController.authLogin
);
router.post(
  "/change-password",
  auth("student", "admin", "faculty"),
  validateRequest(AuthValidations.ChangePasswordValidationSchema),
  AuthController.changePasssword
);
router.post(
  "/refresh-token",
  validateRequest(AuthValidations.RefreshTokenValidationSchema),
  AuthController.refreshToken
);
router.post(
  "/forget-password",
  validateRequest(AuthValidations.ForgetPasswordValidationSchema),
  AuthController.forgetPassword
);
router.post(
  "/reset-password",
  validateRequest(AuthValidations.ResetPasswordValidationSchema),
  AuthController.resetPassword
);

export const AuthRoutes = router;
