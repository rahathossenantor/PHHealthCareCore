import { TTokenPayload } from "../../types/global.types";
import prisma from "../../utils/prisma";

const getSuperAdminMeta = async () => {
    const {
        totalAppointments,
        totalDoctors,
        totalPatients,
        totalPayments,
        totalRevenue
    } = await getAdminMeta();

    const totalAdmins = await prisma.admin.count();

    return {
        totalAppointments,
        totalDoctors,
        totalPatients,
        totalPayments,
        totalRevenue,
        totalAdmins
    };
};

const getAdminMeta = async () => {
    const totalAppointments = await prisma.appointment.count();
    const totalDoctors = await prisma.doctor.count();
    const totalPatients = await prisma.patient.count();
    const totalPayments = await prisma.payment.count();

    const totalRevenue = await prisma.payment.aggregate({
        where: {
            status: "PAID"
        },
        _sum: {
            amount: true
        }
    });

    return {
        totalAppointments,
        totalDoctors,
        totalPatients,
        totalPayments,
        totalRevenue
    };
};

const getDoctorMeta = async (user: TTokenPayload) => {
    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const totalAppointments = await prisma.appointment.count({
        where: {
            doctorId: doctor.id
        }
    });

    const totalPatients = await prisma.appointment.groupBy({
        by: ["patientId"],
        _count: {
            id: true
        }
    });

    const totalReviews = await prisma.review.count({
        where: {
            doctorId: doctor.id
        }
    });

    const totalRevenue = await prisma.payment.aggregate({
        where: {
            status: "PAID",
            appointment: {
                doctorId: doctor.id
            }
        },
        _sum: {
            amount: true
        }
    });

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ["status"],
        where: {
            doctorId: doctor.id
        },
        _count: {
            id: true
        }
    });

    return {
        totalAppointments,
        totalPatients,
        totalReviews,
        totalRevenue,
        appointmentStatusDistribution
    };
};

const getPatientMeta = async (user: TTokenPayload) => {
    const patient = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const totalAppointments = await prisma.appointment.count({
        where: {
            patientId: patient.id
        }
    });

    const totalPrescriptions = await prisma.prescription.count({
        where: {
            patientId: patient.id
        }
    });

    const totalReviews = await prisma.review.count({
        where: {
            patientId: patient.id
        }
    });

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ["status"],
        where: {
            patientId: patient.id
        },
        _count: {
            id: true
        }
    });

    return {
        totalAppointments,
        totalPrescriptions,
        totalReviews,
        appointmentStatusDistribution
    };
};

const getMetadataFromDB = async (user: TTokenPayload) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: "ACTIVE"
        }
    });

    let res = null;

    if (user.role === "SUPER_ADMIN") {
        res = await getSuperAdminMeta();
    } else if (user.role === "ADMIN") {
        res = await getAdminMeta();
    } else if (user.role === "DOCTOR") {
        res = await getDoctorMeta(user);
    } else if (user.role === "PATIENT") {
        res = await getPatientMeta(user);
    };

    return res;
};

const metaServices = {
    getMetadataFromDB
};

export default metaServices;
