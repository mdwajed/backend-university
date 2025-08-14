export const SemesterStatus = ["UPCOMING", "ONGOING", "ENDED"] as const;
export const Status = {
  UPCOMING: "UPCOMING",
  ONGOING: "ONGOING",
  ENDED: "ENDED",
} as const;

export type TSemesterStatus = (typeof SemesterStatus)[number];
