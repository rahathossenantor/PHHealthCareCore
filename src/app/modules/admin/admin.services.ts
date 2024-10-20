import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdminsFromDB = async (query: Record<string, any>) => {
    const res = await prisma.admin.findMany();
    return res;
};

const adminServices = {
    getAllAdminsFromDB
};

export default adminServices;
