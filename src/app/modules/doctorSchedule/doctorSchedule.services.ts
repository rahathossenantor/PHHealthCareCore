import { DoctorSchedule, Prisma } from "@prisma/client";
import { TMeta, TOptions, TTokenPayload } from "../../types/global.types";
import prisma from "../../utils/prisma";
import paginateAndSortCalc from "../../utils/paginateAndSortCalc";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createDoctorScheduleIntoDB = async (user: TTokenPayload, payload: { scheduleIds: string[] }) => {
    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const schedules = payload.scheduleIds.map((scheduleId) => ({
        doctorId: doctor.id,
        scheduleId
    }));

    const res = await prisma.doctorSchedule.createMany({
        data: schedules
    });

    return res;
};

const getAllDoctorSchedulesFromDB = async () => {
    const schedules = prisma.doctorSchedule.findMany();
    return schedules;
};

const getMySchedulesFromDB = async (query: any, user: TTokenPayload, options: Partial<TOptions>): Promise<{
    meta: TMeta;
    data: DoctorSchedule[];
}> => {
    const filterConditions: Prisma.DoctorScheduleWhereInput[] = [];
    const { startDateTime, endDateTime, ...restFilterConditions } = query;
    const { page, limit, skip } = paginateAndSortCalc(options as TOptions);

    if (startDateTime && endDateTime) {
        filterConditions.push({
            AND: [
                {
                    schedule: {
                        startDateTime: {
                            gte: startDateTime
                        }
                    }
                },
                {
                    schedule: {
                        endDateTime: {
                            lte: endDateTime
                        }
                    }
                }
            ]
        });
    };

    // search on separate fields specifically
    if (Object.keys(restFilterConditions).length) {
        const typeOfIsBooked = typeof restFilterConditions.isBooked === "string";
        if (typeOfIsBooked && restFilterConditions.isBooked === "true") {
            restFilterConditions.isBooked = true;
        } else if (typeOfIsBooked && restFilterConditions.isBooked === "false") {
            restFilterConditions.isBooked = false;
        };

        filterConditions.push({
            AND: Object.keys(restFilterConditions).map(key => ({
                [key]: {
                    equals: (restFilterConditions as Record<string, any>)[key]
                }
            }))
        });
    };

    const whereConditions: Prisma.DoctorScheduleWhereInput = filterConditions.length ? { AND: filterConditions } : {};

    const res = await prisma.doctorSchedule.findMany({
        where: whereConditions,
        include: {
            schedule: {
                select: {
                    startDateTime: true,
                    endDateTime: true
                }
            }
        },
        skip,
        take: limit
    });

    const total = await prisma.doctorSchedule.count({
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

const getDoctorSchedulesFromDB = async () => {
    const doctorSchedules = await prisma.doctorSchedule.findMany({
        include: {
            schedule: true
        }
    });

    return doctorSchedules;
};

const deleteMyScheduleFromDB = async (user: TTokenPayload, scheduleId: string) => {
    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        },
        select: {
            id: true
        }
    });

    const isTheScheduleBooked = await prisma.doctorSchedule.findFirst({
        where: {
            scheduleId,
            doctorId: doctor.id,
            isBooked: true
        }
    });
    if (isTheScheduleBooked) {
        throw new AppError(httpStatus.BAD_REQUEST, "This schedule is already booked!");
    };

    const res = await prisma.doctorSchedule.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctor.id,
                scheduleId
            }
        }
    });

    return res;
};

const doctorScheduleServices = {
    createDoctorScheduleIntoDB,
    getAllDoctorSchedulesFromDB,
    getMySchedulesFromDB,
    deleteMyScheduleFromDB,
    getDoctorSchedulesFromDB
};

export default doctorScheduleServices;
