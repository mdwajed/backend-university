import express from "express";
import stripSensitiveFields from "../../../middlewares/stripSensitiveFields.js";
import validateRequest from "../../../middlewares/validateRequest.js";
import { StudentController } from "./student.controller.js";
import { studentZodValidations } from "./student.validation.js";
const router = express.Router();

router.get("/", StudentController.getAllStudents);
router.get("/:id", StudentController.getStudentById);
router.patch(
  "/:id",
  stripSensitiveFields(["id", "email", "user"]),
  validateRequest(studentZodValidations.updateStudentZodSchema),
  StudentController.updateStudent
);
router.delete("/:id", StudentController.deleteStudent);

export const StudentRoutes = router;
