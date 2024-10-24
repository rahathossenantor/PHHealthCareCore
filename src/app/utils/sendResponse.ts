import { Response } from "express";
import { TMeta } from "../types/global.types";

const sendResponse = <T>(res: Response, payload: {
    statusCode: number,
    success: boolean,
    message: string,
    meta?: TMeta,
    data: T | T[] | null | undefined,
}) => {
    res.status(payload.statusCode).json({
        success: payload.success,
        message: payload.message,
        meta: payload.meta || undefined,
        data: payload.data || null || undefined
    });
};

export default sendResponse;
