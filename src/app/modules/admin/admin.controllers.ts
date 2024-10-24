import { Request, Response } from "express";
import adminServices from "./admin.services";
import pick from "../../utils/pick";
import { adminFiltarableFields, adminOptions } from "./admin.constants";

const getAllAdmins = async (req: Request, res: Response) => {
    const query = pick(req.query, adminFiltarableFields);
    const options = pick(req.query, adminOptions);

    try {
        const response = await adminServices.getAllAdminsFromDB(query, options);
        return res.status(200).json({
            success: true,
            message: "Admins fetched successfully.",
            meta: response.meta,
            data: response.data
        });
    } catch (err: any) {
        return res.status(200).json({
            success: false,
            message: err.message || "Something went wrong!",
            error: err
        });
    };
};

const getSingleAdmin = async (req: Request, res: Response) => {
    try {
        const response = await adminServices.getSingleAdminFromDB(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Admin fetched successfully.",
            data: response
        });
    } catch (err: any) {
        return res.status(200).json({
            success: false,
            message: err.message || "Something went wrong!",
            error: err
        });
    };
};

const updateAdmin = async (req: Request, res: Response) => {
    try {
        const response = await adminServices.updateAdminIntoDB(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: "Admin updated successfully.",
            data: response
        });
    } catch (err: any) {
        return res.status(200).json({
            success: false,
            message: err.message || "Something went wrong!",
            error: err
        });
    };
};

const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const response = await adminServices.deleteAdminFromDB(req.params.id);
        console.log(response);
        return res.status(200).json({
            success: true,
            message: "Admin deleted successfully.",
            data: response
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
    getAllAdmins,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin
};

export default adminControllers;
