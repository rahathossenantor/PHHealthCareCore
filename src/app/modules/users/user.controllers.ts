import {NextFunction, Request, Response} from "express";
import userServices from "./user.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admin = await userServices.createAdminIntoDB(req.body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Admin created successfully.",
            data: admin
        });
    } catch (err: any) {
        next(err);
    }
};

const userControllers = {
    createAdmin
};

export default userControllers;
