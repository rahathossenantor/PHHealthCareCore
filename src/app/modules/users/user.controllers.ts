import { Request, Response } from "express";
import userServices from "./user.services";

const createAdmin = async (req: Request, res: Response) => {
    const admin = await userServices.createAdminIntoDB(req.body);
    return res.send(admin);
};

const userControllers = {
    createAdmin
};

export default userControllers;
