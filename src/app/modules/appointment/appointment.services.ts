import { TTokenPayload } from "../../types/global.types";
import prisma from "../../utils/prisma";

const createAppointmentIntoDB = async (user: TTokenPayload, payload: any) => {
    const patient = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    console.log(patient);
    console.log(payload);

    return payload;
};

const appointmentServices = {
    createAppointmentIntoDB
};

export default appointmentServices;
