import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (controllerFn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controllerFn(req, res, next);
        } catch (err: any) {
            next(err);
        };
        // Promise.resolve(controllerFn(req, res, next)).catch(err => next(err));
    };
};

export default catchAsync;
