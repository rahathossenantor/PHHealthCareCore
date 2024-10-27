import { UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";

export const createToken = (
    jwtPayload: { email: string, role: UserRole },
    secret: string,
    expiresIn: string
): string => {
    const token = jwt.sign(
        jwtPayload,
        secret,
        { algorithm: "HS256", expiresIn }
    );
    return token;
};
