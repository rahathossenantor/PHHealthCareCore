import { AppointmentStatus, Prisma } from "@prisma/client";
import { TOptions, TTokenPayload } from "../../types/global.types";
import prisma from "../../utils/prisma";
import { v4 as uuidv4 } from "uuid";
import paginateAndSortCalc from "../../utils/paginateAndSortCalc";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createAppointmentIntoDB = async (user: TTokenPayload, payload: any) => {
    const patient = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
            isDeleted: false
        }
    });

    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    });

    await prisma.doctorSchedule.findUniqueOrThrow({
        where: {
            doctorId_scheduleId: {
                doctorId: doctor.id,
                scheduleId: payload.scheduleId
            },
            isBooked: false
        }
    });

    payload.videoCallingId = uuidv4();

    const res = prisma.$transaction(async (transactionClient) => {
        const appointment = await transactionClient.appointment.create({
            data: {
                ...payload,
                patientId: patient.id
            },
            include: {
                payment: true
            }
        });

        await transactionClient.doctorSchedule.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctor.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true,
                appointmentId: appointment.id
            }
        });

        const transactionId: string = uuidv4();

        await transactionClient.payment.create({
            data: {
                appointmentId: appointment.id,
                amount: doctor.appointmentFee,
                transactionId
            }
        });

        return appointment;
    });

    return res;
};

const getMyAppointmentsFromDB = async (user: TTokenPayload, filterOptions: any, options: Partial<TOptions>) => {
    const filterConditions: Prisma.AppointmentWhereInput[] = [];
    const { page, limit, skip, sortBy, sortOrder } = paginateAndSortCalc(options as TOptions);

    if (user.role === "DOCTOR") {
        filterConditions.push({
            doctor: {
                email: user.email
            }
        });
    } else if (user.role === "PATIENT") {
        filterConditions.push({
            patient: {
                email: user.email
            }
        });
    };

    // search on separate fields specifically
    if (Object.keys(filterOptions).length) {
        filterConditions.push({
            AND: Object.keys(filterOptions).map(key => ({
                [key]: {
                    equals: (filterOptions as Record<string, any>)[key]
                }
            }))
        });
    };

    const whereConditions: Prisma.AppointmentWhereInput = filterConditions.length ? { AND: filterConditions } : {};

    const res = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: user.role === "DOCTOR" ? {
            patient: {
                include: {
                    medicalReport: true,
                    patientHealth: true
                }
            }
        } : {
            doctor: true
        }
    });

    const total = await prisma.appointment.count({
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

const changeAppointmentStatus = async (user: TTokenPayload, id: string, payload: { status: AppointmentStatus }) => {
    const appointment = await prisma.appointment.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            doctor: true
        }
    });

    if (user.role === "DOCTOR") {
        if (appointment.doctor.email !== user.email) {
            throw new AppError(httpStatus.FORBIDDEN, "You're not allowed to access this resource!");
        };
    };

    const res = await prisma.appointment.update({
        where: {
            id
        },
        data: payload
    });

    return res;
};

const cancelUnpaidAppointments = async () => {
    const thirtyMinutesTime = new Date(Date.now() - 30 * 60 * 1000);

    const appointments = await prisma.appointment.findMany({
        where: {
            createdAt: {
                lte: thirtyMinutesTime
            },
            paymentStatus: "UNPAID"
        }
    });

    const appointmentIds = appointments.map((appointment) => appointment.id);

    await prisma.$transaction(async (transactionClient) => {
        await transactionClient.payment.deleteMany({
            where: {
                appointmentId: {
                    in: appointmentIds
                }
            }
        });

        await transactionClient.appointment.deleteMany({
            where: {
                id: {
                    in: appointmentIds
                }
            }
        });

        for (const appointment of appointments) {
            await transactionClient.doctorSchedule.updateMany({
                where: {
                    doctorId: appointment.doctorId,
                    scheduleId: appointment.scheduleId
                },
                data: {
                    isBooked: false
                }
            });
        };
    });
};

const appointmentServices = {
    createAppointmentIntoDB,
    getMyAppointmentsFromDB,
    changeAppointmentStatus,
    cancelUnpaidAppointments
};

export default appointmentServices;
