import { UserRole } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import verifyToken from "../utils/verifyToken";
import config from "../config";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

const auth = (...roles: UserRole[]) => {
    return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized request!");
        };

        // check if the token is valid
        const decoded = await verifyToken(token, config.jwt_access_secret as string);

        if (!roles.includes(decoded.role)) {
            throw new AppError(httpStatus.FORBIDDEN, "You're not allowed to access this resource!", "Forbidden!");
        };

        next();
    });
};

export default auth;
