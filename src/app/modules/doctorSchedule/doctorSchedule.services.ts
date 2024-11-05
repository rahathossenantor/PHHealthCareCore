import { TTokenPayload } from "../../types/global.types";
import prisma from "../../utils/prisma";

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

const doctorScheduleServices = {
    createDoctorScheduleIntoDB
};

export default doctorScheduleServices;
