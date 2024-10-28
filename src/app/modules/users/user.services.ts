import { UserRole } from "@prisma/client";
import prisma from "../../utils/prisma";
import hashPassword from "../../utils/hashPassword";
import { Request } from "express";
import uploadImage from "../../utils/uploadImage";

const createAdminIntoDB = async (req: Request) => {
    const { body, file } = req;
    const payload = JSON.parse(body.data);

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

const userServices = {
    createAdminIntoDB
};

export default userServices;
