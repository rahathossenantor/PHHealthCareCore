import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import specialtyServices from "./specialty.services";

const createSpeciality = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await specialtyServices.createSpecialityIntoDB(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Speciality created successfully.",
        data: response
    });
});

const specialtyControllers = {
    createSpeciality
};

export default specialtyControllers;
