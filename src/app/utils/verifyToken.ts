import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const verifyToken = async (token: string, secret: Secret) => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch (err: any) {
        throw new Error(err.message);
    };
};

export default verifyToken;
