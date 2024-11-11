import { Router } from "express";
import auth from "../../middlewares/auth";
import metaControllers from "./meta.controllers";

const router = Router();

router.get(
    "/",
    auth("SUPER_ADMIN", "ADMIN", "DOCTOR", "PATIENT"),
    metaControllers.getMetadata
);

const metaRoutes = router;

export default metaRoutes;
