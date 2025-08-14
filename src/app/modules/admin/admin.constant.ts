export const Gender = ["male", "female", "other"] as const;
export const BloodGroup = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type TGender = (typeof Gender)[number];
export type TBloodGroup = (typeof BloodGroup)[number];

export const AdminSearchableFields = [
  "email",
  "id",
  "contactNo",
  "emergencyContactNo",
  "name.firstName",
  "name.lastName",
  "name.middleName",
];
