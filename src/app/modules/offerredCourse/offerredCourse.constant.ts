export const Days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"] as const;

export type TDays = (typeof Days)[number];

export const offeredCourseSearchableField = ["days", "startTime", "endTime"];
