import { UserRole } from "@prisma/client";
import jwt, { Secret } from "jsonwebtoken";

export const createToken = (
    jwtPayload: { email: string, role: UserRole },
    secret: Secret,
    expiresIn: string
): string => {
    const token = jwt.sign(
        jwtPayload,
        secret,
        { algorithm: "HS256", expiresIn }
    );
    return token;
};
