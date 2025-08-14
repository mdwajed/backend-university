import { Router } from "express";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route.js";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route.js";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route.js";
import { AdminRoutes } from "../modules/admin/admin.route.js";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { CourseRoutes } from "../modules/course/course.route.js";
import { FacultyRoutes } from "../modules/faculty/faculty.route.js";
import { OfferedCourseRoutes } from "../modules/offerredCourse/offerredCourse.route.js";
import { SemesterRegistrationRoutes } from "../modules/semesterRegistration/semesterRegistration.route.js";
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
  {
    path: "/academic-departments",
    route: AcademicDepartmentRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/faculties",
    route: FacultyRoutes,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  {
    path: "/semester-registration",
    route: SemesterRegistrationRoutes,
  },
  {
    path: "/offered-courses",
    route: OfferedCourseRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
