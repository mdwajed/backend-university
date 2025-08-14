import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest.js";
import { AcademicDepartmentControllers } from "./academicDepartment.controller.js";
import { academicDepartmentZodValidations } from "./academicDepartment.validation.js";

const router = Router();
router.get("/", AcademicDepartmentControllers.getAllAcademicDepartment);
router.get(
  "/:departmentId",
  AcademicDepartmentControllers.getSingleAcademicDepartment
);
router.post(
  "/create-department",
  validateRequest(
    academicDepartmentZodValidations.createAcademicDepartmentZodSchema
  ),
  AcademicDepartmentControllers.createAcademicDepartment
);
router.patch(
  "/:departmentId",
  validateRequest(
    academicDepartmentZodValidations.updateAcademicDepartmentZodSchema
  ),
  AcademicDepartmentControllers.updateAcademicDepartment
);

export const AcademicDepartmentRoutes = router;
