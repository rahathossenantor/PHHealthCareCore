import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TTokenPayload } from "../../types/global.types";
import prisma from "../../utils/prisma";

const createPrescriptionIntoDB = async (user: TTokenPayload, payload: any) => {
    const appointment = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            paymentStatus: "PAID",
            status: "COMPLETED"
        },
        include: {
            doctor: true
        }
    });

    if (!(user.email === appointment.doctor.email)) {
        throw new AppError(httpStatus.FORBIDDEN, "You're not allowed to access this resource!");
    };

    const res = await prisma.prescription.create({
        data: {
            ...payload,
            doctorId: appointment.doctorId,
            patientId: appointment.patientId
        }
    });

    return res;
};

const getMyPrescriptions = async (user: TTokenPayload) => {
    const prescriptions = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user.email
            }
        }
    });

    return prescriptions;
};

const prescriptionServices = {
    createPrescriptionIntoDB,
    getMyPrescriptions
};

export default prescriptionServices;
