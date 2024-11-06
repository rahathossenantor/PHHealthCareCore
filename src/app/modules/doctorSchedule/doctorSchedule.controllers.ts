import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import doctorScheduleServices from "./doctorSchedule.services";
import { TTokenPayload } from "../../types/global.types";
import pick from "../../utils/pick";
import { filterAndPaginateOptions } from "../../constants/global.constants";

const createDoctorSchedule = catchAsync(async (req: Request & { user?: TTokenPayload }, res: Response, _next: NextFunction) => {
    const response = await doctorScheduleServices.createDoctorScheduleIntoDB(req.user as TTokenPayload, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor schedule created successfully.",
        data: response
    });
});

const getAllDoctorSchedules = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await doctorScheduleServices.getAllDoctorSchedulesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor schedules fetched successfully.",
        data: response
    });
});

const getMySchedules = catchAsync(async (req: Request & { user?: TTokenPayload }, res: Response, _next: NextFunction) => {
    const query = pick(req.query, ["startDateTime", "endDateTime", "isBooked"]);
    const options = pick(req.query, filterAndPaginateOptions);
    const response = await doctorScheduleServices.getMySchedulesFromDB(query, req.user as TTokenPayload, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor schedules fetched successfully.",
        data: response
    });
});

const doctorScheduleControllers = {
    createDoctorSchedule,
    getAllDoctorSchedules,
    getMySchedules
};

export default doctorScheduleControllers;
