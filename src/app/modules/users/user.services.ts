import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12);
};

const prisma = new PrismaClient();

const createAdminIntoDB = async (payload: any) => {
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
