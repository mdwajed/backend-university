import { RequestHandler } from "express";
import { AnyZodObject } from "zod";
import catchAsync from "../app/utils/catchAsync.js";

const validateRequest = (schema: AnyZodObject): RequestHandler => {
  return catchAsync(async (req, res, next): Promise<void> => {
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });
    next();
  });
};
export default validateRequest;

// const validateRequest = (schema: AnyZodObject): RequestHandler => {
//   return catchAsync(async (req, res, next): Promise<void> => {
//     await schema.parseAsync(req.body); // validate directly
//     next();
//   });
// };
