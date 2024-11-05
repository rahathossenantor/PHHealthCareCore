import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import doctorScheduleServices from "./doctorSchedule.services";
import { TTokenPayload } from "../../types/global.types";

const createDoctorSchedule = catchAsync(async (req: Request & { user?: TTokenPayload }, res: Response, _next: NextFunction) => {
    const response = await doctorScheduleServices.createDoctorScheduleIntoDB(req.user as TTokenPayload, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor schedule created successfully.",
        data: response
    });
});

const doctorScheduleControllers = {
    createDoctorSchedule
};

export default doctorScheduleControllers;
