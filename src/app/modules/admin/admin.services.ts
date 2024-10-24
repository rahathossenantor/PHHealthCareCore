import { Prisma } from "@prisma/client";
import { adminSearchableFields } from "./admin.constants";
import paginateAndSortCalc from "../../utils/paginateAndSortCalc";
import { TOptions } from "../../types/global.types";
import prisma from "../../utils/prisma";

const getAllAdminsFromDB = async (query: Record<string, any>, options: Record<string, any>) => {
    const filterConditions: Prisma.AdminWhereInput[] = [];
    const { searchTerm, ...restFilterConditions } = query;
    const { page, limit, skip, sortBy, sortOrder } = paginateAndSortCalc(options as TOptions);

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
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });
    const total = await prisma.admin.count({
        where: whereConditions
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: res
    };
};

const adminServices = {
    getAllAdminsFromDB
};

export default adminServices;
