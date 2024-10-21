import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdminsFromDB = async (query: Record<string, any>) => {
    const filterConditions: Prisma.AdminWhereInput[] = [];
    const searchableFields = ["name", "email"];
    const { searchTerm, ...restFilterConditions } = query;

    // search on multiple fields globally
    if (query.searchTerm) {
        filterConditions.push({
            OR: searchableFields.map(field => ({
                [field]: {
                    contains: query.searchTerm,
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
        where: whereConditions
    });
    return res;
};

const adminServices = {
    getAllAdminsFromDB
};

export default adminServices;
