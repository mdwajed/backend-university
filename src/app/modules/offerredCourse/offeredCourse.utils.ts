import { TFacultyScheduleConflict } from "./offerredCourse.interface.js";
import OfferedCourse from "./offerredCourse.model.js";
export const checkFacultyScheduleConflict = async ({
  faculty,
  academicSemester,
  days,
  startTime,
  endTime,
}: TFacultyScheduleConflict): Promise<boolean> => {
  const conflict = await OfferedCourse.findOne({
    faculty,
    academicSemester,
    days: { $in: days }, // overlap in days
    startTime: { $lt: endTime }, // existing starts before new ends
    endTime: { $gt: startTime }, // existing ends after new starts
  });
  return conflict !== null;
};
