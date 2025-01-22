import prisma from "../../utils/prisma";
import checkPassword from "../../utils/checkPassword";
import { createToken } from "./auth.utils";
import verifyToken from "../../utils/verifyToken";
import { UserStatus } from "@prisma/client";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import hashPassword from "../../utils/hashPassword";
import sendEmail from "../../utils/sendEmail";

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

const changePassword = async (decodedUser: any, payload: any) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedUser.email,
            status: UserStatus.ACTIVE
        }
    });

    const isPasswordMatched = await checkPassword(payload.oldPassword, user.password);
    if (!isPasswordMatched) {
        throw new Error("Invalid credentials.");
    };

    const hashedPassword = await hashPassword(payload.newPassword);
    await prisma.user.update({
        where: {
            email: user.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    });

    return null;
};

const forgotPassword = async (payload: { email: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const passwordResetToken = createToken(
        {
            email: user.email,
            role: user.role
        },
        config.jwt_reset_pass_access_secret as Secret,
        config.jwt_reset_pass_access_expires_in as string
    );

    const resetLink = `${config.reset_password_url}/reset-password?id=${user.id}&email=${user.email}&token=${passwordResetToken}`;
    await sendEmail(user.email, resetLink);

    return { resetLink };
};

const resetPassword = async (resetToken: string, payload: { password: string }) => {
    const decoded = await verifyToken(resetToken, config.jwt_reset_pass_access_secret as Secret);

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: decoded.email,
            status: UserStatus.ACTIVE
        }
    });

    const hashedPassword = await hashPassword(payload.password);
    await prisma.user.update({
        where: {
            email: user.email
        },
        data: {
            password: hashedPassword
        }
    });

    return null;
};

const authServices = {
    loginUser,
    getRefreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};

export default authServices;
