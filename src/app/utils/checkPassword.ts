import bcrypt from "bcrypt";

const checkPassword = async (plainTextPass: string, hashedPass: string): Promise<boolean> => {
    return await bcrypt.compare(plainTextPass, hashedPass);
};

export default checkPassword;
