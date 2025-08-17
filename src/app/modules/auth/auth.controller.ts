import { StatusCodes } from "http-status-codes";
import config from "../../config/index.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AuthService } from "./auth.service.js";

const authLogin = catchAsync(async (req, res) => {
  const result = await AuthService.authUser(req.body);
  const { refreshToken, accessToken, needPasswordChange } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
  });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User Login Successfully",
    data: {
      accessToken,
      needPasswordChange,
    },
  });
});
const changePasssword = catchAsync(async (req, res) => {
  await AuthService.changePassword(req.user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Password Changed Successfully",
    data: null,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Access Token Retrieve Successfully",
    data: result,
  });
});
const forgetPassword = catchAsync(async (req, res) => {
  const result = await AuthService.forgetPassword(req.body.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Reset Password Link Created Successfully",
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await AuthService.resetPassword(req.body, token as string);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Reset Password Successfully",
    data: result,
  });
});
export const AuthController = {
  authLogin,
  changePasssword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
