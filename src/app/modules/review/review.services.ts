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

    const review = await prisma.review.create({
        data: {
            appointmentId: appointment.id,
            doctorId: appointment.doctorId,
            patientId: patient.id,
            rating: payload.rating,
            comment: payload.comment
        }
    });

    return review;
};

const reviewServices = {
    createReviewIntoDB
};

export default reviewServices;
