import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../app/config/index.js";
import { User } from "../app/modules/user/user.model.js";
import { ApiError } from "../app/utils/ApiError.js";
import catchAsync from "../app/utils/catchAsync.js";
const auth = (...userRole: string[]) => {
  return catchAsync(async (req, res, next): Promise<void> => {
    const token = req.headers.authorization;
    // check user sent token in request
    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, `You are not authorise !`);
    }
    // check token is valid
    const decoded = jwt.verify(
      token,
      config.access_token_secret as string
    ) as JwtPayload;
    const { userId, role, iat } = decoded;
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

    // check role
    if (userRole.length && !userRole.includes(role)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, `You are not authorise !`);
    }
    req.user = decoded as JwtPayload;
    next();
  });
};
export default auth;
