import prisma from "../../utils/prisma";
import checkPassword from "../../utils/checkPassword";
import { createToken } from "./auth.utils";
import verifyToken from "../../utils/verifyToken";
import { UserStatus } from "@prisma/client";
import config from "../../config";
import { Secret } from "jsonwebtoken";

const loginUser = async (payload: any) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const isPasswordMatched = await checkPassword(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new Error("Invalid credentials.");
    };

    const accessToken = createToken(
        {
            email: user.email,
            role: user.role
        },
        config.jwt_access_secret as Secret,
        config.jwt_access_expires_in as string
    );
    const refreshToken = createToken(
        {
            email: user.email,
            role: user.role
        },
        config.jwt_refresh_secret as Secret,
        config.jwt_refresh_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user.needPasswordChange
    };
};

const getRefreshToken = async (refreshToken: string) => {
    const decoded = await verifyToken(refreshToken, config.jwt_refresh_secret as Secret);

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: decoded.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = createToken(
        {
            email: user.email,
            role: user.role
        },
        config.jwt_access_secret as Secret,
        config.jwt_access_expires_in as string
    );

    return accessToken;
};

const authServices = {
    loginUser,
    getRefreshToken
};

export default authServices;
