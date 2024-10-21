import { Request, Response } from "express";
import adminServices from "./admin.services";
import pick from "../../utils/pick";

const getAllAdmins = async (req: Request, res: Response) => {
    const query = pick(req.query, ["searchTerm", "name", "email", "contactNumber"]);
    try {
        const admins = await adminServices.getAllAdminsFromDB(query);
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
