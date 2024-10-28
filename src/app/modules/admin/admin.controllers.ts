import { NextFunction, Request, Response } from "express";
import adminServices from "./admin.services";
import pick from "../../utils/pick";
import { adminFiltarableFields } from "./admin.constants";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { filterAndPaginateOptions } from "../../constants/global.constants";

const getAllAdmins = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const query = pick(req.query, adminFiltarableFields);
    const options = pick(req.query, filterAndPaginateOptions);

    const response = await adminServices.getAllAdminsFromDB(query, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admins fetched successfully.",
        meta: response.meta,
        data: response.data
    });
});

const getSingleAdmin = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await adminServices.getSingleAdminFromDB(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin fetched successfully.",
        data: response
    });
});

const updateAdmin = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await adminServices.updateAdminIntoDB(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin updated successfully.",
        data: response
    });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await adminServices.deleteAdminFromDB(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin deleted successfully.",
        data: response
    });
});

const adminControllers = {
    getAllAdmins,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin
};

export default adminControllers;
