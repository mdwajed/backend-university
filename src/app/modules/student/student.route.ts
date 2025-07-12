import express from "express";
import { StudentController } from "./student.controller.js";
const router = express.Router();

router.get("/", StudentController.getAllStudents);
router.get("/:studentId", StudentController.getStudentById);
router.delete("/:studentId", StudentController.deleteStudent);

export const StudentRoute = router;
