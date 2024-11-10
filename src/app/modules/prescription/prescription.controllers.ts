import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { TTokenPayload } from "../../types/global.types";
import prescriptionServices from "./prescription.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPrescription = catchAsync(async (req: Request & { user?: TTokenPayload }, res: Response, _next: NextFunction) => {
    const response = await prescriptionServices.createPrescriptionIntoDB(req.user as TTokenPayload, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Prescription created successfully.",
        data: response
    });
});

const prescriptionControllers = {
    createPrescription
};

export default prescriptionControllers;
