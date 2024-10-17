import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const createAdminIntoDB = async (payload: any) => {
    const userData = {
        email: payload.admin.email,
        password: payload.password,
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
