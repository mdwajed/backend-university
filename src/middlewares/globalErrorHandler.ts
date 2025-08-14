import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import config from "../app/config/index.js";
import { ApiError } from "../app/utils/ApiError.js";

const isDuplicateKeyError = (
  err: any
): err is mongoose.mongo.MongoServerError =>
  err?.code === 11000 && err?.name === "MongoServerError";

export const globalErrorHandler: ErrorRequestHandler = (
  err: unknown,
  _req,
  res,
  _next
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation Failed",
      errorMessages: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
      stack: config.node_env === "development" ? err.stack : undefined,
    });
    return;
  }
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      message: "Mongoose Validation Error",
      errorMessages: Object.values(err.errors).map((e) => ({
        path: e.path,
        message: e.message,
      })),
      stack: config.node_env === "development" ? err.stack : undefined,
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: "Mongoose Cast Error",
      errorMessages: [
        { path: err.path, message: `Invalid ${err.path}:${err.message}` },
      ],
      stack: config.node_env === "development" ? err.stack : undefined,
    });
    return;
  }

  if (isDuplicateKeyError(err)) {
    const fields = Object.keys(err.keyValue || {});
    res.status(409).json({
      success: false,
      message: "Duplicate Key Error",
      errMessages: fields.map((field) => ({
        path: field,
        message: `${field} must be unique`,
      })),
      stack: config.node_env === "development" ? err.stack : undefined,
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorMessages: [{ path: "", message: err.message }],
      stack: config.node_env === "development" ? err.stack : undefined,
    });
    return;
  }

  const genericError = err as Error;
  res.status(500).json({
    success: false,
    message: genericError?.message || "Internal Server Error",
    errorMessages: [
      { path: "", message: genericError?.message || "Something went wrong" },
    ],
    stack: config.node_env === "development" ? genericError.stack : undefined,
  });
};
