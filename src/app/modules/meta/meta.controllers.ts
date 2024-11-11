import httpStatus from "http-status";
import { TTokenPayload } from "../../types/global.types";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import metaServices from "./meta.services";
import { NextFunction, Request, Response } from "express";

const getMetadata = catchAsync(async (req: Request & { user?: TTokenPayload }, res: Response, _next: NextFunction) => {
    const response = await metaServices.getMetadataFromDB(req.user as TTokenPayload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Metadata fetched successfully.",
        data: response
    });
});

const metaControllers = {
    getMetadata
};

export default metaControllers;
