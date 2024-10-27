import prisma from "../../utils/prisma";
import checkPassword from "../../utils/checkPassword";

const loginUser = async (payload: any) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email
        }
    });

    const isPasswordMatched = await checkPassword(payload.password, user.password);
    console.log(isPasswordMatched);

    return user;
};

const authServices = {
    loginUser
};

export default authServices;
