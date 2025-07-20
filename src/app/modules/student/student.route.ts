import express from "express";
import stripSensitiveFields from "../../../middlewares/stripSensitiveFields.js";
import validateRequest from "../../../middlewares/validateRequest.js";
import { StudentController } from "./student.controller.js";
import { studentZodValidations } from "./student.validation.js";
const router = express.Router();

router.get("/", StudentController.getAllStudents);
router.get("/:studentId", StudentController.getStudentById);
router.patch(
  "/:studentId",
  stripSensitiveFields(["id", "email", "user"]),
  validateRequest(studentZodValidations.updateStudentZodSchema),
  StudentController.updateStudent
);
router.delete("/:studentId", StudentController.deleteStudent);

export const StudentRoutes = router;
