import { Patient, Prisma } from "@prisma/client";
import { TMeta, TOptions } from "../../types/global.types";
import prisma from "../../utils/prisma";
import paginateAndSortCalc from "../../utils/paginateAndSortCalc";
import { patientSearchableFields } from "./patient.constants";
import { TPatientSearchParams } from "./patient.types";

const getAllPatientsFromDB = async (query: TPatientSearchParams, options: Partial<TOptions>): Promise<{
    meta: TMeta;
    data: Patient[];
}> => {
    const filterConditions: Prisma.PatientWhereInput[] = [{
        isDeleted: false
    }];
    const { searchTerm, ...restFilterConditions } = query;
    const { page, limit, skip, sortBy, sortOrder } = paginateAndSortCalc(options as TOptions);

    // search on multiple fields globally
    if (searchTerm) {
        filterConditions.push({
            OR: patientSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    };

    // search on seperate fields specifically
    if (Object.keys(restFilterConditions).length) {
        filterConditions.push({
            AND: Object.keys(restFilterConditions).map(key => ({
                [key]: {
                    equals: (restFilterConditions as Record<string, any>)[key]
                }
            }))
        });
    };

    const whereConditions: Prisma.PatientWhereInput = filterConditions.length ? { AND: filterConditions } : {};
    const res = await prisma.patient.findMany({
        where: whereConditions,
        include: {
            medicalReport: true,
            patientHealth: true
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });
    const total = await prisma.patient.count({
        where: whereConditions
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: res
    };
};

const getSinglePatientFromDB = async (id: string): Promise<Patient | null> => {
    const patient = await prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    return patient;
};

const patientServices = {
    getAllPatientsFromDB,
    getSinglePatientFromDB
};

export default patientServices;
