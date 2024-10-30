import { Admin, Doctor, Patient, Prisma, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../utils/prisma";
import hashPassword from "../../utils/hashPassword";
import uploadImage from "../../utils/uploadImage";
import { TFile, TOptions, TTokenPayload } from "../../types/global.types";
import paginateAndSortCalc from "../../utils/paginateAndSortCalc";
import { userSearchableFields } from "./user.constants";
import { Request } from "express";
import config from "../../config";

const createAdminIntoDB = async (file: TFile | undefined, payload: any) => {
    if (file) {
        const res = await uploadImage(file);
        payload.admin.profilePhoto = res?.secure_url;
    };

    const hashedPassword = await hashPassword(payload.password || config.default_pass);

    const userData = {
        email: payload.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    };

    const res = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const admin = await transactionClient.admin.create({
            data: payload.admin
        });

        return admin;
    });

    return res;
};

const createDoctorIntoDB = async (file: TFile | undefined, payload: any) => {
    if (file) {
        const res = await uploadImage(file);
        payload.doctor.profilePhoto = res?.secure_url;
    };

    const hashedPassword = await hashPassword(payload.password || config.default_pass);

    const userData = {
        email: payload.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    };

    const res = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const doctor = await transactionClient.doctor.create({
            data: payload.doctor
        });

        return doctor;
    });

    return res;
};

const createPatientIntoDB = async (file: TFile | undefined, payload: any) => {
    if (file) {
        const res = await uploadImage(file);
        payload.patient.profilePhoto = res?.secure_url;
    };

    const hashedPassword = await hashPassword(payload.password || config.default_pass);

    const userData = {
        email: payload.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    };

    const res = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const patient = await transactionClient.patient.create({
            data: payload.patient
        });

        return patient;
    });

    return res;
};

const getAllUsersFromDB = async (query: any, options: Partial<TOptions>) => {
    const filterConditions: Prisma.UserWhereInput[] = [];
    const { searchTerm, ...restFilterConditions } = query;
    const { page, limit, skip, sortBy, sortOrder } = paginateAndSortCalc(options as TOptions);

    // search on multiple fields globally
    if (searchTerm) {
        filterConditions.push({
            OR: userSearchableFields.map(field => ({
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

    const whereConditions: Prisma.UserWhereInput = filterConditions.length ? { AND: filterConditions } : {};

    const res = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            admin: true,
            doctor: true,
            patient: true,
            createdAt: true,
            updatedAt: true,
            needPasswordChange: true
        }
    });
    const total = await prisma.user.count({
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

const updateUserStatusIntoDB = async (id: string, data: { status: UserStatus }) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    const res = await prisma.user.update({
        where: {
            id
        },
        data
    });
    return res;
};

const getMeFromDB = async (tokenData: TTokenPayload) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: tokenData.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });

    let me: Admin | Doctor | Patient | null = null;
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
        me = await prisma.admin.findUniqueOrThrow({
            where: {
                email: user.email
            }
        });
    } else if (user.role === UserRole.DOCTOR) {
        me = await prisma.doctor.findUniqueOrThrow({
            where: {
                email: user.email
            }
        });
    } else if (user.role === UserRole.PATIENT) {
        me = await prisma.patient.findUniqueOrThrow({
            where: {
                email: user.email
            }
        });
    };

    return {
        ...user,
        ...me
    };
};

const updateMeIntoDB = async (req: Request & { user: TTokenPayload }) => {
    const { body, file, user: tokenData } = req;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: tokenData.email,
            status: UserStatus.ACTIVE
        }
    });

    if (file) {
        const res = await uploadImage(file);
        body.profilePhoto = res?.secure_url;
    };

    let me: Admin | Doctor | Patient | null = null;
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
        me = await prisma.admin.update({
            where: {
                email: user.email
            },
            data: body
        });
    } else if (user.role === UserRole.DOCTOR) {
        me = await prisma.doctor.update({
            where: {
                email: user.email
            },
            data: body
        });
    } else if (user.role === UserRole.PATIENT) {
        me = await prisma.patient.update({
            where: {
                email: user.email
            },
            data: body
        });
    };

    return me;
};

const userServices = {
    createAdminIntoDB,
    createDoctorIntoDB,
    createPatientIntoDB,
    getAllUsersFromDB,
    updateUserStatusIntoDB,
    getMeFromDB,
    updateMeIntoDB
};

export default userServices;
