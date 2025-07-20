import { Router } from "express";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route.js";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route.js";
import { StudentRoutes } from "../modules/student/student.route.js";
import { UserRoutes } from "../modules/user/user.route.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/academic-semesters",
    route: AcademicSemesterRoutes,
  },
  {
    path: "/academic-faculties",
    route: AcademicFacultyRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
