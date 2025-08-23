export const Grade = ["A", "B", "C", "D", "F", "N/A"] as const;

export type TGrade = (typeof Grade)[number];
