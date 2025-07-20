import { NextFunction, Request, Response } from "express";

const stripSensitiveFields = (fields: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    fields.forEach((field) => {
      if (req.body.student?.[field]) {
        delete req.body.student[field];
      }
    });
    next();
  };
};

export default stripSensitiveFields;
