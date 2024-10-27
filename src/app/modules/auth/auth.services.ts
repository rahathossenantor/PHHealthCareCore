import prisma from "../../utils/prisma";
import checkPassword from "../../utils/checkPassword";
import { createToken } from "./auth.utils";
import verifyToken from "../../utils/verifyToken";
import { UserStatus } from "@prisma/client";

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
        process.env.JWT_SECRET!,
        "10m"
    );
    const refreshToken = createToken(
        {
            email: user.email,
            role: user.role
        },
        "12qw32537gdfe3",
        "30d"
    );

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user.needPasswordChange
    };
};

const getRefreshToken = async (refreshToken: string) => {
    const decoded = await verifyToken(refreshToken, "12qw32537gdfe3");

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
        process.env.JWT_SECRET!,
        "10m"
    );

    return accessToken;
};

const authServices = {
    loginUser,
    getRefreshToken
};

export default authServices;
