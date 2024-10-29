import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import specialtyServices from "./specialty.services";

const createSpecialty = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await specialtyServices.createSpecialtyIntoDB(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Specialty created successfully.",
        data: response
    });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await specialtyServices.getAllSpecialtiesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Specialties fetched successfully.",
        data: response
    });
});

const specialtyControllers = {
    createSpecialty,
    getAllSpecialties
};

export default specialtyControllers;
