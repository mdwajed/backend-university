export type TUser = {
  id: string;
  password: string;
  needPasswordChange: boolean;
  role: "admin" | "student" | "faculty";
  status: "in_progress" | "blocked";
  isDeleted: boolean;
};
