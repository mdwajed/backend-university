import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest.js";
import { SemesterRegistrationControllers } from "./semesterRegistration.controller.js";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation.js";

const router = Router();
router.get("/", SemesterRegistrationControllers.getAllSemesterRegistration);
router.get(
  "/:id",
  SemesterRegistrationControllers.getSingleSemesterRegistration
);
router.post(
  "/create-semester-registration",
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationZodSchema
  ),
  SemesterRegistrationControllers.createSemesterRegistration
);
router.patch(
  "/:id",
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationZodSchema
  ),
  SemesterRegistrationControllers.updateSemesterRegistration
);

router.delete(
  "/:id",
  SemesterRegistrationControllers.deleteSemesterRegistration
);

export const SemesterRegistrationRoutes = router;
