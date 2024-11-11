import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { TTokenPayload } from "../../types/global.types";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import reviewServices from "./review.services";

const createReview = catchAsync(async (req: Request & { user?: TTokenPayload }, res: Response, _next: NextFunction) => {
    const response = await reviewServices.createReviewIntoDB(req.user as TTokenPayload, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Review created successfully.",
        data: response
    });
});

const reviewControllers = {
    createReview
};

export default reviewControllers;
