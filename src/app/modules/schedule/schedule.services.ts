import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../utils/prisma";
import { TMeta, TOptions, TTokenPayload } from "../../types/global.types";
import { Prisma, Schedule } from "@prisma/client";
import paginateAndSortCalc from "../../utils/paginateAndSortCalc";

const createScheduleIntoDB = async (payload: any) => {
    const startDate = new Date(payload.startDate);
    const endDate = new Date(payload.endDate);
    const schedules = [];

    while (startDate <= endDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(startDate, "yyyy-MM-dd")}`,
                    Number(payload.startTime.split(":")[0])
                ),
                Number(payload.startTime.split(":")[1])
            )
        );

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(startDate, "yyyy-MM-dd")}`,
                    Number(payload.endTime.split(":")[0])
                ),
                Number(payload.endTime.split(":")[1])
            )
        );

        while (startDateTime < endDateTime) {
            const schedule = {
                startDateTime,
                endDateTime: addMinutes(startDateTime, 30)
            };

            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: schedule.startDateTime,
                    endDateTime: schedule.endDateTime
                }
            });

            if (!existingSchedule) {
                const dbRes = await prisma.schedule.create({
                    data: schedule
                });
                schedules.push(dbRes);
            };

            startDateTime.setMinutes(startDateTime.getMinutes() + 30);
        };

        startDate.setDate(startDate.getDate() + 1);
    };

    return schedules;
};

const getAllSchedulesFromDB = async (query: any, user: TTokenPayload, options: Partial<TOptions>): Promise<{
    meta: TMeta;
    data: Schedule[];
}> => {
    const filterConditions: Prisma.ScheduleWhereInput[] = [];
    const { startDateTime, endDateTime, ...restFilterConditions } = query;
    const { page, limit, skip, sortBy, sortOrder } = paginateAndSortCalc(options as TOptions);

    if (startDateTime && endDateTime) {
        filterConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDateTime
                    }
                },
                {
                    endDateTime: {
                        lte: endDateTime
                    }
                }
            ]
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

    const whereConditions: Prisma.ScheduleWhereInput = filterConditions.length ? { AND: filterConditions } : {};

    const doctorSchedules = await prisma.doctorSchedule.findMany({
        where: {
            doctor: {
                email: user.email
            }
        }
    });

    const doctorScheduleIds = doctorSchedules.map((schedule) => schedule.scheduleId);

    const res = await prisma.schedule.findMany({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        }
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

const scheduleServices = {
    createScheduleIntoDB,
    getAllSchedulesFromDB
};

export default scheduleServices;
