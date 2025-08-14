import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface.js";

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: { type: String, unique: true, required: true },
    academicFaculty: { type: Schema.Types.ObjectId, ref: "AcademicFaculty" },
  },
  { timestamps: true }
);

// academicDepartmentSchema.pre("save", async function (next) {
//   const isDepartmentExist = await (this.constructor as any).findOne({
//     name: this.name,
//   });
//   if (isDepartmentExist) {
//     throw new ApiError(StatusCodes.CONFLICT, `${this.name} is already exist`);
//   }
//   next();
// });

export const AcademicDepartment = model<TAcademicDepartment>(
  "AcademicDepartment",
  academicDepartmentSchema
);
