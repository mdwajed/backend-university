export const UserRoles = ["admin", "student", "faculty"] as const;
export const UserStatus = ["in_progress", "blocked"] as const;

export type TUserRole = (typeof UserRoles)[number];
export type TUserStatus = (typeof UserStatus)[number];
