import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { ApiError } from "./ApiError.js";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
    return;
  }
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      message: "Mongoose Validation Error",
      errors: Object.values(err.errors).map((e) => ({
        path: e.path,
        message: e.message,
      })),
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
    return;
  }
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorMessages: [{ path: "", message: err.message }],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
    return;
  }
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errorMessages: [{ path: "", message: err.message }],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
