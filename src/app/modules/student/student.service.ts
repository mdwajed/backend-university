import { TStudent } from "./student.interface.js";
import { Student } from "./student.model.js";

const getAllStudents = async () => {
  const result = await Student.find();
  return result;
};

const getStudentById = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};

const updateStudent = async (id: string, payload: Partial<TStudent>) => {
  const student = await Student.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return student;
};

const deleteStudent = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentService = {
  getAllStudents,
  getStudentById,
  deleteStudent,
  updateStudent,
};
