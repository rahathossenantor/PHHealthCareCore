import { NextFunction, Request, Response } from "express";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { filterAndPaginateOptions } from "../../constants/global.constants";
import { doctorFiltarableFields } from "./doctor.constants";
import doctorServices from "./doctor.services";

const getAllDoctors = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const query = pick(req.query, doctorFiltarableFields);
    const options = pick(req.query, filterAndPaginateOptions);

    const response = await doctorServices.getAllDoctorsFromDB(query, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctors fetched successfully.",
        meta: response.meta,
        data: response.data
    });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await doctorServices.deleteDoctorFromDB(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor deleted successfully.",
        data: response
    });
});

const doctorControllers = {
    getAllDoctors,
    deleteDoctor
};

export default doctorControllers;
