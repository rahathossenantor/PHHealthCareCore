import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { TTokenPayload } from "../../types/global.types";
import appointmentServices from "./appointment.services";

const createAppointment = catchAsync(async (req: Request & { user?: TTokenPayload }, res: Response, _next: NextFunction) => {
    const response = await appointmentServices.createAppointmentIntoDB(req.user as TTokenPayload, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Appointment created successfully.",
        data: response
    });
});

const appointmentControllers = {
    createAppointment
};

export default appointmentControllers;
