import bcrypt from "bcrypt";

const hashPassword: (password: string) => Promise<string> = async (password: string) => {
    return await bcrypt.hash(password, 12);
};

export default hashPassword;
