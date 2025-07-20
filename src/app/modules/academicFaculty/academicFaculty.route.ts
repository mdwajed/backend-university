import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest.js";
import { AcademicFacultyControllers } from "./academicFaculty.controller.js";
import { academicFacultyZodValidations } from "./academicFaculty.validation.js";

const router = Router();
router.get("/", AcademicFacultyControllers.getAllAcademicFaculty);
router.get("/:facultyId", AcademicFacultyControllers.getSingleAcademicFaculty);
router.post(
  "/create-faculty",
  validateRequest(academicFacultyZodValidations.createAcademicFacultyZodSchema),
  AcademicFacultyControllers.createAcademicFaculty
);
router.patch(
  "/:facultyId",
  validateRequest(academicFacultyZodValidations.updateAcademicFacultyZodSchema),
  AcademicFacultyControllers.updateAcademicFaculty
);

export const AcademicFacultyRoutes = router;
