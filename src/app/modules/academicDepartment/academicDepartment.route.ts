import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest.js";
import { AcademicFacultyControllers } from "./academicDepartment.controller.js";
import { academicDepartmentZodValidations } from "./academicDepartment.validation.js";

const router = Router();
router.get("/", AcademicFacultyControllers.getAllAcademicFaculty);
router.get(
  "/:departmentId",
  AcademicFacultyControllers.getSingleAcademicFaculty
);
router.post(
  "/create-department",
  validateRequest(
    academicDepartmentZodValidations.createAcademicDepartmentZodSchema
  ),
  AcademicFacultyControllers.createAcademicFaculty
);
router.patch(
  "/:departmentId",
  validateRequest(
    academicDepartmentZodValidations.updateAcademicDepartmentZodSchema
  ),
  AcademicFacultyControllers.updateAcademicFaculty
);

export const AcademicDepartmentRoutes = router;
