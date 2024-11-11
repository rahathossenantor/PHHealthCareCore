import { TTokenPayload } from "../../types/global.types";
import prisma from "../../utils/prisma";

const getSuperAdminMeta = async () => {};

const getAdminMeta = async () => {
    const totalAppointments = await prisma.appointment.count();
    const totalDoctors = await prisma.doctor.count();
    const totalPatients = await prisma.patient.count();
    const totalPayments = await prisma.payment.count();
    
    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        }
    });
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
};

const getPatientMeta = async () => {};

const getMetadataFromDB = async (user: TTokenPayload) => {
    const user = await prisma.user.findUniqueOrThrow({
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
        res = await getDoctorMeta();
    } else if (user.role === "PATIENT") {
        res = await getPatientMeta();
    }
    
    return res;
};

const metaServices = {
    getMetadataFromDB
};

export default metaServices;
