import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../utils/prisma";

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

const getAllSchedulesFromDB = async () => {
    const schedules = await prisma.schedule.findMany();
    return schedules;
};

const scheduleServices = {
    createScheduleIntoDB,
    getAllSchedulesFromDB
};

export default scheduleServices;
