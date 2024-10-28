import { UserRole } from "@prisma/client";
import prisma from "../../utils/prisma";
import hashPassword from "../../utils/hashPassword";
import uploadImage from "../../utils/uploadImage";
import { TFile } from "../../types/global.types";

const createAdminIntoDB = async (file: TFile, payload: any) => {
    if (file) {
        const res = await uploadImage(file);
        payload.admin.profilePhoto = res?.secure_url;
    };

    const hashedPassword = await hashPassword(payload.password);

    const userData = {
        email: payload.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    };

    const res = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const admin = await transactionClient.admin.create({
            data: payload.admin
        });

        return admin;
    });

    return res;
};

const createDoctorIntoDB = async (file: TFile, payload: any) => {
    if (file) {
        const res = await uploadImage(file);
        payload.doctor.profilePhoto = res?.secure_url;
    };

    const hashedPassword = await hashPassword(payload.password);

    const userData = {
        email: payload.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    };

    const res = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const doctor = await transactionClient.doctor.create({
            data: payload.doctor
        });

        return doctor;
    });

    return res;
};

const createPatientIntoDB = async (file: TFile, payload: any) => {
    if (file) {
        const res = await uploadImage(file);
        payload.patient.profilePhoto = res?.secure_url;
    };

    const hashedPassword = await hashPassword(payload.password);

    const userData = {
        email: payload.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    };

    const res = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const patient = await transactionClient.patient.create({
            data: payload.patient
        });

        return patient;
    });

    return res;
};

const userServices = {
    createAdminIntoDB,
    createDoctorIntoDB,
    createPatientIntoDB
};

export default userServices;
