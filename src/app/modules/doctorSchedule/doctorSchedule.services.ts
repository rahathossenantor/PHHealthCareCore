import { TTokenPayload } from "../../types/global.types";
import prisma from "../../utils/prisma";

const createDoctorScheduleIntoDB = async (user: TTokenPayload, payload: { scheduleIds: string[] }) => {
    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    console.log(user);
    console.log(doctor);
    console.log(payload);
};

const doctorScheduleServices = {
    createDoctorScheduleIntoDB
};

export default doctorScheduleServices;
