import { Router } from "express";
import adminControllers from "./admin.controllers";
import requestValidator from "../../middlewares/requestValidator";
import { adminValidations } from "./admin.validations";

const router = Router();

router.get(
    "/",
    adminControllers.getAllAdmins
);

router.get(
    "/:id",
    adminControllers.getSingleAdmin
);

router.patch(
    "/:id",
    requestValidator(adminValidations.updateSchema),
    adminControllers.updateAdmin
);

router.delete(
    "/:id",
    adminControllers.deleteAdmin
);

const adminRoutes = router;

export default adminRoutes;
