// offerredCourse.validation.ts
import { z } from "zod";
import { Days } from "./offerredCourse.constant.js";

const objectIdRegex = /^[a-f\d]{24}$/i;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const objectId = z.string().regex(objectIdRegex, {
  message: "Invalid ObjectId",
});

const timeString = z.string().regex(timeRegex, {
  message: "Time must be in HH:MM 24-hour format",
});

const createOfferedCourseZodSchema = z.object({
  body: z
    .object({
      semesterRegistration: objectId,
      academicFaculty: objectId,
      academicDepartment: objectId,
      course: objectId,
      faculty: objectId,
      maxCapacity: z.number({ required_error: "Max capacity is required" }),
      section: z.number({ required_error: "Section is required" }),
      days: z.array(z.enum([...Days] as [string, ...string[]]), {
        required_error: "Day is required",
      }),
      startTime: timeString,
      endTime: timeString,
    })
    .refine(
      (data) => {
        const [startH, startM] = data.startTime.split(":").map(Number);
        const [endH, endM] = data.endTime.split(":").map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        return endMinutes > startMinutes;
      },
      {
        message: "End time must be after start time",
        path: ["endTime"], // This highlights the `endTime` field in case of error
      }
    ),
});

const updateOfferedCourseZodSchema = z.object({
  body: z
    .object({
      faculty: objectId,
      maxCapacity: z.number({ required_error: "Max capacity is required" }),
      // section: z.number({ required_error: "Section is required" }),
      days: z.array(z.enum([...Days] as [string, ...string[]]), {
        required_error: "Day is required",
      }),
      startTime: timeString,
      endTime: timeString,
    })
    .refine(
      (data) => {
        const [startH, startM] = data.startTime.split(":").map(Number);
        const [endH, endM] = data.endTime.split(":").map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        return endMinutes > startMinutes;
      },
      {
        message: "End time must be after start time",
        path: ["endTime"], // This highlights the `endTime` field in case of error
      }
    ),
});

export const OfferedCourseValidations = {
  createOfferedCourseZodSchema,
  updateOfferedCourseZodSchema,
};
