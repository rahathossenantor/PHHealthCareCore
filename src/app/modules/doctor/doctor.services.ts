import { Doctor, Prisma, UserStatus } from "@prisma/client";
import paginateAndSortCalc from "../../utils/paginateAndSortCalc";
import prisma from "../../utils/prisma";
import { TMeta, TOptions } from "../../types/global.types";
import { doctorSearchableFields } from "./doctor.constants";
import { TDoctorSearchParams } from "./doctor.types";

const getAllDoctorsFromDB = async (query: TDoctorSearchParams, options: Partial<TOptions>): Promise<{
    meta: TMeta;
    data: Doctor[];
}> => {
    const filterConditions: Prisma.DoctorWhereInput[] = [{
        isDeleted: false
    }];
    const { searchTerm, ...restFilterConditions } = query;
    const { page, limit, skip, sortBy, sortOrder } = paginateAndSortCalc(options as TOptions);

    // search on multiple fields globally
    if (searchTerm) {
        filterConditions.push({
            OR: doctorSearchableFields.map(field => ({
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

    const whereConditions: Prisma.DoctorWhereInput = filterConditions.length ? { AND: filterConditions } : {};
    const res = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });
    const total = await prisma.doctor.count({
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

const updateDoctorIntoDB = async (id: string, payload: Partial<Doctor>): Promise<Doctor> => {
    await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const res = await prisma.doctor.update({
        where: {
            id
        },
        data: payload
    });
    return res;
};

const deleteDoctorFromDB = async (id: string): Promise<Doctor> => {
    await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const res = await prisma.$transaction(async (transactionClient) => {
        const doctor = await transactionClient.doctor.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });
        await transactionClient.user.update({
            where: {
                email: doctor.email
            },
            data: {
                status: UserStatus.DELETED
            }
        });
        return doctor;
    });
    return res;
};

const doctorServices = {
    getAllDoctorsFromDB,
    deleteDoctorFromDB,
    updateDoctorIntoDB
};

export default doctorServices;
