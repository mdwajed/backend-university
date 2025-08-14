import QueryBuilder from "../../builder/QueryBuilder.js";
import calculatePagination from "../../utils/calculatePagination.js";
import { AdminSearchableFields } from "./admin.constant.js";
import { TAdmin } from "./admin.interface.js";
import { Admin } from "./admin.model.js";

export const getAllAdmin = async (query: Record<string, unknown>) => {
  const { page, limit } = calculatePagination({
    page: Number(query.page),
    limit: Number(query.limit),
  });
  const baseQuery = Admin.find();

  const adminQueryBuilder = new QueryBuilder(baseQuery, query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQueryBuilder.modelQuery;

  const total = await Admin.countDocuments();

  return {
    meta: { page, limit, total },
    data: result,
  };
};

export const getAdminById = async (id: string) => {
  const result = await Admin.findById(id);
  return result;
};

const updateAdmin = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = payload;

  const remainingUpdatedAdminData: Record<string, unknown> = {
    ...remainingAdminData,
  };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      remainingUpdatedAdminData[`name.${key}`] = value;
    }
  }
  const result = await Admin.findByIdAndUpdate(id, remainingUpdatedAdminData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteAdmin = async (id: string) => {
  const result = await Admin.findByIdAndDelete(id);
  return result;
};
export const AdminService = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
