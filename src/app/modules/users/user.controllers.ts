import { Request, Response } from "express";
import userServices from "./user.services";
import sendResponse from "../../utils/sendResponse";

const createAdmin = async (req: Request, res: Response) => {
    try {
        const admin = await userServices.createAdminIntoDB(req.body);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Admin created successfully.",
            data: admin
        });
    } catch (err: any) {
        res.status(200).json({
            success: false,
            message: err.message || "Something went wrong!",
            error: err
        });
    };
};

const userControllers = {
    createAdmin
};

export default userControllers;
