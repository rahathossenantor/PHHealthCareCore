import prisma from "../../utils/prisma";
import checkPassword from "../../utils/checkPassword";
import { createToken } from "./auth.utils";

const loginUser = async (payload: any) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email
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

const authServices = {
    loginUser
};

export default authServices;
