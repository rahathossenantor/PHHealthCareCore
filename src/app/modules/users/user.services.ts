import { Admin, Doctor, Patient, Prisma, User, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../utils/prisma";
import hashPassword from "../../utils/hashPassword";
import uploadImage from "../../utils/uploadImage";
import { TFile, TMeta, TOptions } from "../../types/global.types";
import paginateAndSortCalc from "../../utils/paginateAndSortCalc";
import { userSearchableFields } from "./user.constants";

const createAdminIntoDB = async (file: TFile, payload: any) => {
    if (file) {
        const res = await uploadImage(file);
        payload.admin.profilePhoto = res?.secure_url;
    };

    const hashedPassword = await hashPassword(payload.password);

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

const createDoctorIntoDB = async (file: TFile, payload: any) => {
    if (file) {
        const res = await uploadImage(file);
        payload.doctor.profilePhoto = res?.secure_url;
    };

    const hashedPassword = await hashPassword(payload.password);

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

const createPatientIntoDB = async (file: TFile, payload: any) => {
    if (file) {
        const res = await uploadImage(file);
        payload.patient.profilePhoto = res?.secure_url;
    };

    const hashedPassword = await hashPassword(payload.password);

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

const getMeFromDB = async (payload: User) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id
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
                id: user.id
            }
        });
    } else if (user.role === UserRole.DOCTOR) {
        me = await prisma.doctor.findUniqueOrThrow({
            where: {
                id: user.id
            }
        });
    } else if (user.role === UserRole.PATIENT) {
        me = await prisma.patient.findUniqueOrThrow({
            where: {
                id: user.id
            }
        });
    };

    return {
        ...user,
        ...me
    };
};

const userServices = {
    createAdminIntoDB,
    createDoctorIntoDB,
    createPatientIntoDB,
    getAllUsersFromDB,
    updateUserStatusIntoDB,
    getMeFromDB
};

export default userServices;
