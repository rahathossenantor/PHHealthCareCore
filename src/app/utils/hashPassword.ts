import bcrypt from "bcrypt";
import config from "../config";

const hashPassword: (password: string) => Promise<string> = async (password: string) => {
    return await bcrypt.hash(password, config.bcrypt_salt_rounds as string);
};

export default hashPassword;
