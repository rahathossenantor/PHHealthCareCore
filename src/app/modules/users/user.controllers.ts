import { NextFunction, Request, Response } from "express";
import userServices from "./user.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const createAdmin = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const admin = await userServices.createAdminIntoDB(req.file!, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin created successfully.",
        data: admin
    });
});

const createDoctor = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const doctor = await userServices.createDoctorIntoDB(req.file!, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor created successfully.",
        data: doctor
    });
});

const userControllers = {
    createAdmin,
    createDoctor
};

export default userControllers;
