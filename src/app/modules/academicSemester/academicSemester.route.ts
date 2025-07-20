import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest.js";
import { AcademicSemesterControllers } from "./academicSemester.controller.js";
import { academicSemesterZodValidations } from "./academicSemester.validation.js";

const router = Router();

router.get("/", AcademicSemesterControllers.getAllAcademicSemesters);
router.get(
  "/:semesterId",
  AcademicSemesterControllers.getSingleAcademicSemester
);
router.post(
  "/create-semester",
  validateRequest(
    academicSemesterZodValidations.createAcademicSemesterZodSchema
  ),
  AcademicSemesterControllers.createAcademicSemester
);
router.patch(
  "/:semesterId",
  validateRequest(
    academicSemesterZodValidations.updateAcademicSemesterZodSchema
  ),
  AcademicSemesterControllers.updateAcademicSemester
);

export const AcademicSemesterRoutes = router;
