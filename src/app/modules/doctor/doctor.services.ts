import { Doctor, Prisma, UserStatus } from "@prisma/client";
import paginateAndSortCalc from "../../utils/paginateAndSortCalc";
import prisma from "../../utils/prisma";
import { TMeta, TOptions } from "../../types/global.types";
import { doctorSearchableFields, TSpecialty } from "./doctor.constants";
import { TDoctorSearchParams } from "./doctor.types";

const getAllDoctorsFromDB = async (query: TDoctorSearchParams, options: Partial<TOptions>): Promise<{
    meta: TMeta;
    data: Doctor[];
}> => {
    const filterConditions: Prisma.DoctorWhereInput[] = [{
        isDeleted: false
    }];
    const { searchTerm, specialty, ...restFilterConditions } = query;
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

    if (specialty) {
        filterConditions.push({
            doctorSpecialty: {
                some: {
                    specialty: {
                        title: {
                            contains: specialty,
                            mode: "insensitive"
                        }
                    }
                }
            }
        });
    };

    // search on separate fields specifically
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
        include: {
            doctorSpecialty: {
                select: {
                    specialty: true
                }
            }
        },
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

const getSingleDoctorFromDB = async (id: string): Promise<Doctor | null> => {
    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    return doctor;
};

const updateDoctorIntoDB = async (id: string, payload: any) => {
    const { specialties, ...doctorsData } = payload;

    await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    await prisma.$transaction(async (transactionClient) => {
        await transactionClient.doctor.update({
            where: {
                id
            },
            data: doctorsData
        });

        if (specialties as TSpecialty[] && (specialties as TSpecialty[]).length) {
            const deletableSpecialties = specialties.filter((specialty: TSpecialty) => specialty.isDeleted);

            for (const specialty of deletableSpecialties) {
                await transactionClient.doctorSpecialty.deleteMany({
                    where: {
                        doctorId: id,
                        specialtyId: specialty.id
                    }
                });
            };

            const newSpecialties = specialties.filter((specialty: TSpecialty) => !specialty.isDeleted);

            for (const specialty of newSpecialties) {
                await transactionClient.doctorSpecialty.create({
                    data: {
                        doctorId: id,
                        specialtyId: specialty.id
                    }
                });
            };
        };
    });

    const res = await prisma.doctor.findUnique({
        where: {
            id
        },
        include: {
            doctorSpecialty: {
                select: {
                    specialty: true
                }
            }
        }
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
    getSingleDoctorFromDB,
    deleteDoctorFromDB,
    updateDoctorIntoDB
};

export default doctorServices;
