import { Router } from "express";
import adminControllers from "./admin.controllers";

const router = Router();

router.get("/",
    adminControllers.getAllAdmins
);

const adminRoutes = router;

export default adminRoutes;
