import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config/index.js";
import { ApiError } from "../../utils/ApiError.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { User } from "../user/user.model.js";
import { TAuth, TPasswordChange } from "./auth.interface.js";
import { tokenGeneration, verifyToken } from "./auth.utils.js";
const authUser = async (payload: TAuth) => {
  // 1. check user
  const user = await User.findOne({ id: payload?.id }).select("+password");
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, `User is not found !`);
  }
  // 1. check delation
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new ApiError(StatusCodes.FORBIDDEN, `User is already deleted !`);
  }
  // 1. check status
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new ApiError(StatusCodes.FORBIDDEN, `This User is blocked !`);
  }
  // 1. check password
  const matchPassword = await bcrypt.compare(payload?.password, user?.password);
  if (!matchPassword) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Password not matched !`);
  }
  // create token
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  // geneeate access token
  const accessToken = tokenGeneration(
    jwtPayload,
    config.access_token_secret as string,
    config.access_token_expire_time as SignOptions["expiresIn"]
  );
  // geneeate refresh token
  const refreshToken = tokenGeneration(
    jwtPayload,
    config.refresh_token_secret as string,
    config.refresh_token_expire_time as SignOptions["expiresIn"]
  );

  // 5. Return sanitized user data (no password)
  return {
    accessToken,
    refreshToken,
    needPasswordChange: user?.needPasswordChange,
  };
};
const changePassword = async (
  userData: JwtPayload,
  payload: TPasswordChange
) => {
  const { oldPassword, newPassword } = payload;
  // 1. check user
  const user = await User.findOne({ id: userData.userId }).select("+password");
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, `User is not found !`);
  }
  // 1. check delation
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new ApiError(StatusCodes.FORBIDDEN, `User is already deleted !`);
  }
  // 1. check status
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new ApiError(StatusCodes.FORBIDDEN, `This User is blocked !`);
  }
  // 1. check password
  const matchPassword = await bcrypt.compare(oldPassword, user?.password);
  if (!matchPassword) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Password not matched !`);
  }
  const hashedNewPasswprd = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_round)
  );
  const result = await User.findOneAndUpdate(
    {
      id: userData?.userId,
      role: userData?.role,
    },
    {
      password: hashedNewPasswprd,
      needPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true }
  );
  return result;
};

const refreshToken = async (token: string) => {
  // check token is valid
  const decoded = verifyToken(token, config.refresh_token_secret as string);
  const { userId, iat } = decoded;
  // 1. check user
  const user = await User.findOne({ id: userId }).select("+password");
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, `User is not found !`);
  }
  // 1. check delation
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new ApiError(StatusCodes.FORBIDDEN, `User is already deleted !`);
  }
  // 1. check status
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new ApiError(StatusCodes.FORBIDDEN, `This User is blocked !`);
  }
  // ✅ check if password was changed after token was issued
  if (user.passwordChangedAt) {
    const passwordChangedTimestamp = Math.floor(
      new Date(user.passwordChangedAt).getTime() / 1000
    );

    if (passwordChangedTimestamp > iat!) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        `Password changed recently. Please log in again!`
      );
    }
  }
  // create token
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  // geneeate access token
  const accessToken = tokenGeneration(
    jwtPayload,
    config.access_token_secret as string,
    config.access_token_expire_time as SignOptions["expiresIn"]
  );
  return { accessToken };
};
const forgetPassword = async (userId: string) => {
  // 1. check user
  const user = await User.findOne({ id: userId }).select("+password");
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, `User is not found !`);
  }
  // 1. check delation
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new ApiError(StatusCodes.FORBIDDEN, `User is already deleted !`);
  }
  // 1. check status
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new ApiError(StatusCodes.FORBIDDEN, `This User is blocked !`);
  }

  // create token
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  // geneeate access token
  const resetToken = tokenGeneration(
    jwtPayload,
    config.access_token_secret as string,
    "5m"
  );
  const resetUrLink = `${config.reset_pass_url}?id=${user.id}&token=${resetToken}`;

  await sendEmail(
    user.email,
    `<div>
<p>Dear User,</p>
<p>Your Password reset link 
<a href=${resetUrLink}>
<button>Reset Password</button>
</a>
</p>
</div> `
  );
  console.log(resetUrLink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  // 1. check user
  const user = await User.findOne({ id: payload?.id }).select("+password");
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, `User is not found !`);
  }
  // 1. check delation
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new ApiError(StatusCodes.FORBIDDEN, `User is already deleted !`);
  }
  // 1. check status
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new ApiError(StatusCodes.FORBIDDEN, `This User is blocked !`);
  }
  // check token is valid
  const decoded = verifyToken(token, config.access_token_secret as string);
  if (payload?.id !== decoded.userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, `You are not authorize !`);
  }
  const hashedNewPasswprd = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_round)
  );
  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: hashedNewPasswprd,
      needPasswordChange: false,
      PasswordChangedAt: new Date(),
    }
  );
};
export const AuthService = {
  authUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
