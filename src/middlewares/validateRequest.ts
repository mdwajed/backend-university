import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AnyZodObject, ZodError } from "zod";

const validateRequest = (schema: AnyZodObject): RequestHandler => {
  return async (req, res, next): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Validation Error",
          error: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};
export default validateRequest;
