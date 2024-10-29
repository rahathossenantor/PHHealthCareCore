import { NextFunction, Request, Response } from "express";
import userServices from "./user.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import { filterAndPaginateOptions } from "../../constants/global.constants";
import { userFiltarableFields } from "./user.constants";
import { TTokenPayload } from "../../types/global.types";

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

const createPatient = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const patient = await userServices.createPatientIntoDB(req.file!, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient created successfully.",
        data: patient
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const query = pick(req.query, userFiltarableFields);
    const options = pick(req.query, filterAndPaginateOptions);

    const response = await userServices.getAllUsersFromDB(query, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users fetched successfully.",
        meta: response.meta,
        data: response.data
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await userServices.updateUserStatusIntoDB(req.params.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User status updated successfully.",
        data: response
    });
});

const getMe = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await userServices.getMeFromDB(req.user as TTokenPayload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile fetched successfully.",
        data: response
    });
});

const userControllers = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers,
    updateUserStatus,
    getMe
};

export default userControllers;
