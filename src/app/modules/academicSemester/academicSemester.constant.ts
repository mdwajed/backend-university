export const SemesterMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const SemesterName = ["Autumn", "Summer", "Fall"] as const;

export const SemesterCode = ["01", "02", "03"] as const;

export const SemesterNameCodeMapper = {
  Autumn: "01",
  Summer: "02",
  Fall: "03",
} as const;

export type TSemesterMonth = (typeof SemesterMonths)[number];
export type TSemesterName = (typeof SemesterName)[number];
export type TSemesterCode = (typeof SemesterCode)[number];
