import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AdminService } from "./admin.service.js";

const getAllAdmin = catchAsync(async (req, res) => {
  const result = await AdminService.getAllAdmin(req.query);
  sendResponse(res, {
    success: true,
    message: "Admins Data Retrieve Successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getAdminById = catchAsync(async (req, res) => {
  const result = await AdminService.getAdminById(req.params.id);
  sendResponse(res, {
    success: true,
    message: "Admin Data Retrieve Successfully",
    data: result,
  });
});
const updateAdmin = catchAsync(async (req, res) => {
  const result = await AdminService.updateAdmin(req.params.id, req.body.admin);
  sendResponse(res, {
    success: true,
    message: "Admin Data Updated Successfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.deleteAdmin(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin is deleted succesfully",
    data: result,
  });
});
export const AdminController = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
