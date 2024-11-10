import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { TTokenPayload } from "../../types/global.types";
import appointmentServices from "./appointment.services";
import pick from "../../utils/pick";
import { filterAndPaginateOptions } from "../../constants/global.constants";

const createAppointment = catchAsync(async (req: Request & { user?: TTokenPayload }, res: Response, _next: NextFunction) => {
    const response = await appointmentServices.createAppointmentIntoDB(req.user as TTokenPayload, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Appointment created successfully.",
        data: response
    });
});

const getMyAppointments = catchAsync(async (req: Request & { user?: TTokenPayload }, res: Response, _next: NextFunction) => {
    const query = pick(req.query, ["status", "paymentStatus"]);
    const options = pick(req.query, filterAndPaginateOptions);

    const response = await appointmentServices.getMyAppointmentsFromDB(req.user as TTokenPayload, query, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Appointments fetched successfully.",
        data: response
    });
});

const changeAppointmentStatus = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await appointmentServices.changeAppointmentStatus(req.params.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Appointment status updated successfully.",
        data: response
    });
});

const appointmentControllers = {
    createAppointment,
    getMyAppointments,
    changeAppointmentStatus
};

export default appointmentControllers;
