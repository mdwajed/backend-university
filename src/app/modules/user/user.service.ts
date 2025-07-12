import { v4 as uuidv4 } from "uuid";
import config from "../../config/index.js";
import { TStudent } from "../student/student.interface.js";
import { Student } from "../student/student.model.js";
import { TUser } from "./user.interface.js";
import { User } from "./user.model.js";

const createStudent = async (student: TStudent, password: string) => {
  const user: Partial<TUser> = {};
  user.password = password || (config.default_password as string);
  user.role = "student";
  user.id = uuidv4();
  const result = await User.create(user);
  if (Object.keys(result).length) {
    student.id = result.id;
    student.user = result._id;
    const newStudent = await Student.create(student);
    return newStudent;
  }
  return result;
};

export const UserService = {
  createStudent,
};
