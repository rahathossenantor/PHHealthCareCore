import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchableFields } from "./admin.constants";

const prisma = new PrismaClient();

const getAllAdminsFromDB = async (query: Record<string, any>, options: Record<string, any>) => {
    const filterConditions: Prisma.AdminWhereInput[] = [];
    const { searchTerm, ...restFilterConditions } = query;
    const { limit, page } = options;
    console.log(options);

    // search on multiple fields globally
    if (searchTerm) {
        filterConditions.push({
            OR: adminSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    };

    // search on seperate fields specifically
    if (Object.keys(restFilterConditions).length) {
        filterConditions.push({
            AND: Object.keys(restFilterConditions).map(key => ({
                [key]: {
                    equals: restFilterConditions[key]
                }
            }))
        });
    };

    const whereConditions: Prisma.AdminWhereInput = filterConditions.length ? { AND: filterConditions } : {};
    const res = await prisma.admin.findMany({
        where: whereConditions,
        skip: ((Number(page) - 1) * Number(limit)) || 0,
        take: Number(limit) || 10
    });
    return res;
};

const adminServices = {
    getAllAdminsFromDB
};

export default adminServices;
