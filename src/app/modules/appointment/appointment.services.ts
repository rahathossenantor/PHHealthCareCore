import { TTokenPayload } from "../../types/global.types";
import prisma from "../../utils/prisma";
import { v4 as uuidv4 } from "uuid";

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

const appointmentServices = {
    createAppointmentIntoDB
};

export default appointmentServices;
