import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TTokenPayload } from "../../types/global.types";
import prisma from "../../utils/prisma";

const createReviewIntoDB = async (user: TTokenPayload, payload: any) => {
    const patient = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const appointment = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId
        }
    });

    if (!(appointment.patientId === patient.id)) {
        throw new AppError(httpStatus.FORBIDDEN, "You're not allowed to access this resource!");
    };

    const res = await prisma.$transaction(async (transactionClient) => {
        const review = await transactionClient.review.create({
            data: {
                appointmentId: appointment.id,
                doctorId: appointment.doctorId,
                patientId: patient.id,
                rating: payload.rating,
                comment: payload.comment
            }
        });

        const avgRating = await transactionClient.review.aggregate({
            where: {
                id: appointment.doctorId
            },
            _avg: {
                rating: true
            }
        });

        await transactionClient.doctor.update({
            where: {
                id: appointment.doctorId
            },
            data: {
                avgRating: avgRating._avg.rating as number
            }
        });

        return review;
    });

    return res;
};

const reviewServices = {
    createReviewIntoDB
};

export default reviewServices;
