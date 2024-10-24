import { Router } from "express";
import adminControllers from "./admin.controllers";

const router = Router();

router.get("/",
    adminControllers.getAllAdmins
);
router.get("/:id",
    adminControllers.getSingleAdmin
);
router.patch("/:id",
    adminControllers.updateAdmin
);
router.delete("/:id",
    adminControllers.deleteAdmin
);

const adminRoutes = router;

export default adminRoutes;
