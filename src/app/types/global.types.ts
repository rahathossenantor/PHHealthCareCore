export type TOptions = {
    page: string;
    limit: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
};

export type TMeta = {
    page: number;
    limit: number;
    total: number;
};
