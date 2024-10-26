import { NextFunction, Request, Response } from "express";
import userServices from "./user.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const admin = await userServices.createAdminIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin created successfully.",
        data: admin
    });
});

const userControllers = {
    createAdmin
};

export default userControllers;
