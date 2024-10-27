import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import authServices from "./auth.services";

const loginUser = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await authServices.loginUser(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully.",
        data: response
    });
});

const authControllers = {
    loginUser
};

export default authControllers;
