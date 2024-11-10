import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import paymentServices from "./payment.services";

const initializePayment = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await paymentServices.initializePayment(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment initialized successfully.",
        data: response
    });
});

const validatePayment = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await paymentServices.validatePayment(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment validated successfully.",
        data: response
    });
});

const paymentControllers = {
    initializePayment,
    validatePayment
};

export default paymentControllers;
