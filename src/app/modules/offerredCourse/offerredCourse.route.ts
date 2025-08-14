import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest.js";
import { OfferedCourseControllers } from "./offerredCourse.controller.js";
import { OfferedCourseValidations } from "./offerredCourse.validation.js";

const router = Router();
router.get("/", OfferedCourseControllers.getAllOfferedCourse);
router.get("/:id", OfferedCourseControllers.getSingleOfferedCourse);
router.post(
  "/create-offered-course",
  validateRequest(OfferedCourseValidations.createOfferedCourseZodSchema),
  OfferedCourseControllers.createOfferedCourse
);
router.patch(
  "/:id",
  validateRequest(OfferedCourseValidations.updateOfferedCourseZodSchema),
  OfferedCourseControllers.updateOfferedCourse
);

router.delete("/:id", OfferedCourseControllers.deleteOfferedCourse);

export const OfferedCourseRoutes = router;
