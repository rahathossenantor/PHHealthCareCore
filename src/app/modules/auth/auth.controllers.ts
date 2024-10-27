import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import authServices from "./auth.services";
import config from "../../config";

const loginUser = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await authServices.loginUser(req.body);
    const { accessToken, refreshToken, needsPasswordChange } = response;

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully.",
        data: {
            accessToken,
            needsPasswordChange
        }
    });
});

const getRefreshToken = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const { refreshToken } = req.cookies;
    const response = await authServices.getRefreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully.",
        data: {
            accessToken: response
        }
    });
});

const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response, _next: NextFunction) => {
    const response = await authServices.changePassword(req.user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password changed successfully.",
        data: response
    });
});

const forgotPassword = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await authServices.forgotPassword(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password reset link sent successfully.",
        data: response
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const resetToken = req.headers.authorization || "";

    const response = await authServices.resetPassword(resetToken, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password reseted successfully.",
        data: response
    });
});

const authControllers = {
    loginUser,
    getRefreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};

export default authControllers;
