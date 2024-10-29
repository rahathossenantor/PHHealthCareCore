import { UserRole } from "@prisma/client";

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

export type TFile = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
};

export type TTokenPayload = {
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
};
