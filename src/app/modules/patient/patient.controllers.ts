import { NextFunction, Request, Response } from "express";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { filterAndPaginateOptions } from "../../constants/global.constants";
import { patientFiltarableFields } from "./patient.constants";
import patientServices from "./patient.services";

const getAllPatients = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const query = pick(req.query, patientFiltarableFields);
    const options = pick(req.query, filterAndPaginateOptions);

    const response = await patientServices.getAllPatientsFromDB(query, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patients fetched successfully.",
        meta: response.meta,
        data: response.data
    });
});

const getSinglePatient = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await patientServices.getSinglePatientFromDB(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient fetched successfully.",
        data: response
    });
});

const updatePatient = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await patientServices.updatePatientIntoDB(req.params.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient updated successfully.",
        data: response
    });
});

const deletePatient = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const response = await patientServices.deletePatientFromDB(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient deleted successfully.",
        data: response
    });
});

const patientControllers = {
    getAllPatients,
    getSinglePatient,
    updatePatient
};

export default patientControllers;
