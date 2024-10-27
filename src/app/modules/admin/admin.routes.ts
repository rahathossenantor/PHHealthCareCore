import { Router } from "express";
import adminControllers from "./admin.controllers";
import requestValidator from "../../middlewares/requestValidator";
import { adminValidations } from "./admin.validations";
import auth from "../../middlewares/auth";

const router = Router();

router.get(
    "/",
    auth("SUPER_ADMIN", "ADMIN"),
    adminControllers.getAllAdmins
);

router.get(
    "/:id",
    adminControllers.getSingleAdmin
);

router.patch(
    "/:id",
    auth("SUPER_ADMIN", "ADMIN"),
    requestValidator(adminValidations.updateSchema),
    adminControllers.updateAdmin
);

router.delete(
    "/:id",
    auth("SUPER_ADMIN", "ADMIN"),
    adminControllers.deleteAdmin
);

const adminRoutes = router;

export default adminRoutes;
