import express from "express";
import auth from "../../../middlewares/auth.js";
import validateRequest from "../../../middlewares/validateRequest.js";
import { USER_ROLE } from "./auth.const.js";
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
  auth(USER_ROLE.student, USER_ROLE.faculty, USER_ROLE.admin),
  validateRequest(AuthValidations.ChangePasswordValidationSchema),
  AuthController.changePasssword
);
router.post(
  "/refresh-token",
  validateRequest(AuthValidations.RefreshTokenValidationSchema),
  AuthController.refreshToken
);

export const AuthRoutes = router;
