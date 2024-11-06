import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import scheduleServices from "./schedule.services";
import pick from "../../utils/pick";
import { filterAndPaginateOptions } from "../../constants/global.constants";
import { TTokenPayload } from "../../types/global.types";

const createSchedule = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await scheduleServices.createScheduleIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule created successfully.",
        data: response
    });
});

const getAllSchedules = catchAsync(async (req: Request & { user?: TTokenPayload }, res: Response, _next: NextFunction) => {
    const query = pick(req.query, ["startDateTime", "endDateTime"]);
    const options = pick(req.query, filterAndPaginateOptions);

    const response = await scheduleServices.getAllSchedulesFromDB(query, req.user as TTokenPayload, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedules fetched successfully.",
        data: response
    });
});

const getSingleSchedule = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await scheduleServices.getSingleScheduleFromDB(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule fetched successfully.",
        data: response
    });
});

const scheduleControllers = {
    createSchedule,
    getAllSchedules,
    getSingleSchedule
};

export default scheduleControllers;
