import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest.js";
import { CourseControllers } from "./course.controller.js";
import { courseValidations } from "./course.validation.js";

const router = Router();
router.get("/", CourseControllers.getAllCourse);
router.get("/:id", CourseControllers.getSingleCourse);
router.post(
  "/create-course",
  validateRequest(courseValidations.createCourseZodSchema),
  CourseControllers.createCourse
);
router.patch(
  "/:id",
  validateRequest(courseValidations.updateCourseZodSchema),
  CourseControllers.updateCourse
);
router.put(
  "/:courseId/assign-faculties",
  validateRequest(courseValidations.courseFacultyZodSchema),
  CourseControllers.assignCourseFaculty
);
router.delete(
  "/:courseId/remove-faculties",
  validateRequest(courseValidations.courseFacultyZodSchema),
  CourseControllers.removeCourseFaculty
);
router.delete("/:id", CourseControllers.deleteCourse);

export const CourseRoutes = router;
