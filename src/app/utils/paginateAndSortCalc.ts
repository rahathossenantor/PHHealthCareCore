import { TOptions } from "../types/global.types";

const paginateAndSortCalc = (options: TOptions): {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
} => {
    // pagination
    const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const skip: number = (page - 1) * limit;

    // sorting
    const sortBy: string = options.sortBy || "createdAt";
    const sortOrder: "asc" | "desc" = options.sortOrder || "desc";

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    };
};

export default paginateAndSortCalc;
