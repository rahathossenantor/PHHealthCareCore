import { Request, Response } from "express";
import adminServices from "./admin.services";
import pick from "../../utils/pick";
import { adminFiltarableFields, adminOptions } from "./admin.constants";

const getAllAdmins = async (req: Request, res: Response) => {
    const query = pick(req.query, adminFiltarableFields);
    const options = pick(req.query, adminOptions);

    try {
        const admins = await adminServices.getAllAdminsFromDB(query, options);
        return res.status(200).json({
            success: true,
            message: "Admins fetched successfully.",
            data: admins
        });
    } catch (err: any) {
        return res.status(200).json({
            success: false,
            message: err.message || "Something went wrong!",
            error: err
        });
    };
};

const adminControllers = {
    getAllAdmins
};

export default adminControllers;
