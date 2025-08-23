import express from "express";
import validateRequest from "../../../middlewares/validateRequest.js";

import auth from "../../../middlewares/auth.js";
import { EnrolledCourseController } from "./enroll.course.controller.js";
import { EnrolledCourseValidations } from "./enroll.course.validation.js";
const router = express.Router();

router.post(
  "/create-enrolled-course",
  auth("student"),
  validateRequest(
    EnrolledCourseValidations.CreateEnrolledCourseValidationSchema
  ),
  EnrolledCourseController.createEnrolledCourse
);
router.patch(
  "/update-enrolled-course-marks",
  auth("faculty", "admin"),
  validateRequest(EnrolledCourseValidations.UpdateCourseMarksValidationSchema),
  EnrolledCourseController.updateEnrolledCourseMarks
);

export const EnrolledCourseRoutes = router;
